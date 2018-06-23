function isInt(value) {
    return value !== null && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

module.exports = function(app) {
    app.route('/patients')
        .get(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            db.user.findAll({ 
                attributes: [ 'id', 'first_name', 'last_name', 'email'],
                include: [{ 
                    model: db.medical_record, attributes: [ 'id', 'user_id', 'birthday', 'height', 'weight', 'notes' ]
                }, { 
                    model: db.appointment, as: 'appointments', attributes: [ 'id', 'patient_id', 'dot', 'height', 'weight', 'glucotest', 'reason', 'notes' ],
                    include: [
                        { model: db.doctor_operation_time },
                        { model: db.treatment, attributes: [ 'id', 'appointment_id', 'notes' ],
                        include: { model: db.treatment_detail, attributes: [ 'id', 'task', 'compliance', 'frequency_id', 'treatment_id' ],
                            include: [{ model: db.frequency, attributes: [ 'id', 'abbreviation', 'definition' ]}, { model: db.route, attributes: [ 'id', 'abbreviation', 'definition' ]} ]}}]
                }],
                where: { rol_id: { [Op.eq]: 2 }}
            })
            .then(patients => {
                if (patients.length <= 0) {
                    return res.status(404).json({ 'error': 'Couldn\'t fetch any patient' })
                }
                return res.status(200).json(patients);
            })
            .catch(error => {
                return next(error);
            })
                      
        });
    app.route('/patients/:id')
        .get(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const patientId = req.params.id;
            db.user.findById(patientId, { 
                attributes: [ 'id', 'first_name', 'last_name', 'email', 'rol_id'],
                include: [{ 
                    model: db.medical_record, attributes: [ 'id', 'user_id', 'birthday', 'height', 'weight', 'notes' ]
                }, { 
                    model: db.appointment, as: 'appointments', attributes: [ 'id', 'patient_id', 'dot', 'height', 'weight', 'glucotest', 'reason', 'notes' ],
                    include: [
                        { model: db.doctor_operation_time },
                        { model: db.treatment, attributes: [ 'id', 'appointment_id', 'notes' ],
                        include: { model: db.treatment_detail, attributes: [ 'id', 'task', 'compliance', 'frequency_id', 'treatment_id' ],
                            include: [{ model: db.frequency, attributes: [ 'id', 'abbreviation', 'definition' ]}, { model: db.route, attributes: [ 'id', 'abbreviation', 'definition' ]} ]}}]
                }]
            })
            .then(patient => {
                if (!patient || patient.rol_id !== 2) {
                    return res.status(404).json({ 'error': 'Patient not found' })
                }
                return res.status(200).json(patient);
            })
            .catch(error => {
                return next(error);
            })
        })
}