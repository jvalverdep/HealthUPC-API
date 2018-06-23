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
                                    return res.status(201).json(newAppointment);
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
        // .put(async (req, res) => {
        //     const db = req.app.db;
        //     const Op = db.Sequelize.Op;
        //     const consultationId = req.params.cId;
        //     if (!isInt(consultationId)) {
        //         res.status(400).json({'error': 'Not integer'});
        //         return;
        //     }
        //     const consultation = req.body;
        //     db.consultation.update(consultation, { where: { id: { [Op.eq]: consultationId }}})
        //         .then(consultation => {
        //             res.status(200).json(consultation);
        //         })
        //         .catch(error => {
        //             res.json({ 'error': `Couldn\'t update. ${error}` });
        //         });
        // })
}