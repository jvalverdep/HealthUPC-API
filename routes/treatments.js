function isInt(value) {
    return value !== null && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

module.exports = function(app) {
    // Patient treatments list
    
    app.route('/treatments')
        .post(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const treatment = req.body;
            db.treatment.create(treatment, { include: { model: db.treatment_detail }})
                .then(newTreatment => {
                    res.status(201).json(newTreatment);
                })
                .catch(error => {
                    res.json({ 'error': `Couldn\'t create. ${error}` });
                })
                
        })
        // .post(async (req, res, next) => {
        //     const db = req.app.db;
        //     const Op = db.Sequelize.Op;
        //     const patientId = req.params.id;
        //     const consultation = req.body;
        //     if (!isInt(patientId)) {
        //         res.status(400).json({'error': 'Not integer'});
        //         return;
        //     }
        //     const user = await db.user.findById(patientId);
        //     if (!user) {
        //         res.status(404).json({'error': 'Patient not found'});
        //         return;
        //     }
        //     const medicalRecord = await user.getMedicalRecord();

        //     if (!medicalRecord) {
        //         res.status(404).json({'error': 'Patient doesn\'t have a medical history' });
        //         return;
        //     }
        //     db.consultation.create(consultation)
        //         .then(newConsultation => {
        //             medicalRecord.addConsultations(newConsultation);
        //             res.status(201).json(newConsultation);
        //         })
        //         .catch(error => {
        //             res.json({ 'error': `Couldn\'t create. ${error}` });
        //         });
        // });
    app.route('/treatments/:id')
        .get(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const treatmentId = req.params.id;
            db.treatment.findById(treatmentId, {
                attributes: [ 'id', 'appointment_id', 'notes' ],
                        include: { model: db.treatment_detail, attributes: [ 'id', 'task', 'compliance', 'frequency_id', 'treatment_id' ],
                            include: { model: db.frequency, attributes: [ 'id', 'frequency' ] }}
            })
                .then(medicalRecord => {
                    if (!medicalRecord) {
                        res.status(404).json({ 'error': 'Treatment not found' });
                        return;
                    } else {
                        return res.status(200).json(medicalRecord);
                    }
                })
                .catch(error => {
                    return next(error);
                })
        });
}