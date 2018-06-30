function isInt(value) {
    return value !== null && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

module.exports = function(app) {
    // Patient consultations list
    app.route('/appointments')
        .post(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const appointment = req.body;
            
            db.doctor_operation_time.findById(appointment.dot)
                .then(dot => {
                    if (dot) {
                        db.appointment.findOrCreate({ where: { 
                            patient_id: { [Op.eq]: appointment.patient_id },
                            dot: { [Op.eq]: appointment.dot }
                        }, defaults: {
                            patient_id: appointment.patient_id,
                            height: appointment.height,
                            weight: appointment.weight,
                            glucotest: appointment.glucotest,
                            dot: appointment.dot,
                            reason: appointment.reason,
                            notes: appointment.notes
                        }})
                            .spread((newAppointment, created) => {
                                if (created) {
                                    db.doctor_operation_time.update({ available: 0}, { where: { id: { [Op.eq]: appointment.dot }}})
                                    .then(updated => {
                                        if (updated) {
                                            return res.status(201).json(newAppointment);
                                        }
                                    })
                                    .catch(error => {
                                        res.json({ 'error': `Couldn\'t update. ${error}` });
                                    });
                                } else {
                                    return res.status(200).json({ 'error': 'This appointment already exists.' });
                                }
                            })
                            .catch(error => {
                                return res.status(200).json({ 'error': `Couldn\'t create. ${error}` });
                            });
                    } else {
                        return res.status(200).json({ 'error': 'dot doesn\'t exists.' });
                    }
                })
                .catch(error => {
                    return res.status(200).json({ 'error': error });
                });
            });
    
    app.route('/appointments/:id')
        .get(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const appointmentId = req.params.id;
            db.appointment.findById(appointmentId, {
                attributes: [ 'id', 'patient_id', 'dot', 'height', 'weight', 'glucotest', 'reason', 'notes' ]
            })
                .then(appointment => {
                    if (!appointment) {
                        res.status(404).json({ 'error': 'Appointment not found' });
                        return;
                    } else {
                        return res.status(200).json(appointment);
                    }
                })
                .catch(error => {
                    return next(error);
                })
        })
        .put(async (req, res) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const appointmentId = req.params.id;
            const appointment = req.body;

            db.appointment.update(appointment, { where: { id: { [Op.eq]: appointmentId }}})
                .then(updated => {
                    if (updated) {
                        return res.status(200).json({ 'status': 'OK', 'message': 'success' });
                    }
                })
                .catch(error => {
                    return res.json({ 'error': `Couldn\'t update. ${error}` });
                });
        })
        .delete(async (req, res) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const appointmentId = req.params.id;
            const appointment = req.body;

            db.appointment.findById(appointmentId)
                .then(async appointmentdb => {
                    if (appointmentdb) {
                        let dot = appointmentdb.dot;
                        await appointmentdb.destroy();
                        db.doctor_operation_time.update({ available: true }, { where: { id: { [Op.eq]: dot }}})
                            .then(updated => {
                                if (updated) {
                                    return res.status(200).json({ 'status': 'OK', 'message': 'success' });
                                }
                            })
                            .catch(error => {
                                return res.json({ 'error': `Couldn\'t complete. ${error}` });
                            });
                    } else {
                        return res.json({ 'error': 'Appointment doesn\'t exists.' });
                    }
                    
                })
        })
}