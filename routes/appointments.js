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
            db.appointment.create(appointment)
                .then(newAppointment => {
                    res.status(201).json(newAppointment);
                })
                .catch(error => {
                    res.json({ 'error': `Couldn\'t create. ${error}` });
                });
            });
    
    app.route('/appointments/:id')
        .get(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const appointmentId = req.params.id;
            db.appointment.findById(appointmentId, {
                attributes: [ 'id', 'patient_id', 'doctor_id', 'height', 'weight', 'glucotest', 'scheduled', 'reason', 'notes' ]
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