function isInt(value) {
    return value !== null && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

module.exports = function(app) {
    // In order to get all the actualization of the medical record and the consultations, and treatments the patient is following.
    app.route('/medical_records')
        .post(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const medicalRecord = req.body;
            const userId = medicalRecord.user_id;
            db.user.findById(userId)
                .then(user => {
                    if (!user) {
                        res.status(404).json({ 'error': 'User not found' });
                        return;
                    } else {
                        user.getMedical_record().then(storedMedicalRecord => {
                            if (storedMedicalRecord) {
                                res.status(201).json({ 'error': 'Medical record already created' });
                                return;
                            } else {
                                db.medical_record.create(medicalRecord)
                                    .then(newMedicalRecord => {
                                        res.status(201).json(newMedicalRecord);
                                    })
                                    .catch(error => {
                                        res.json({ 'error': `Couldn\'t create. ${error}` });
                                    });
                            }
                        })
                        .catch(error => {
                            return next(error);
                        });
                    }
                })
                .catch(error => {
                    return next(error);
                });            
        });
    app.route('/medical_records/:id')
        .get(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const medicalRecordId = req.params.id;
            db.medical_record.findById(medicalRecordId, {
                attributes: [ 'id', 'user_id', 'birthday', 'height', 'weight', 'notes' ]
            })
                .then(medicalRecord => {
                    if (!medicalRecord) {
                        res.status(404).json({ 'error': 'Medical record not found' });
                        return;
                    } else {
                        return res.status(200).json(medicalRecord);
                    }
                })
                .catch(error => {
                    return next(error);
                })
        })
        // .put(async (req, res) => {
        //     const db = req.app.db;
        //     const Op = db.Sequelize.Op;
        //     const patientId = req.params.id;
        //     const medicalRecord = req.body;
        //     if (!isInt(patientId)) {
        //         res.status(400).json({'error': 'Not integer'});
        //         return;
        //     }
        //     const user = await db.user.findById(patientId);
        //     if (!user) {
        //         res.status(404).json({ 'error': 'Patient not found' });
        //         return;
        //     }
        //     const medicalRecordStored = await user.getMedicalRecord();
        //     if (!medicalRecordStored) {
        //         res.status(404).json({ 'error': 'User doesn\'t have a medical history' });
        //         return;
        //     }
        //     const medicalRecordId = medicalRecordStored.id;

        //     db.medical_record.update(medicalRecord, { where: { id: { [Op.eq]: medicalRecordId }}})
        //         .then(medical_record => {
        //             res.status(200).json(medical_record);
        //         })
        //         .catch(error => {
        //             res.json({ 'error': `Couldn\'t update. ${error}` });
        //         });
        // });   
}