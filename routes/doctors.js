function isInt(value) {
    return value !== null && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

module.exports = function(app) {
    app.route('/doctors')
        .get(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            db.user.findAll({ 
                attributes: [ 'first_name', 'last_name', 'email', 'profession' ],
                where: { rol_id: { [Op.eq]: '1' }}
            })
            .then(doctors => {
                if (doctors.length <= 0) {
                    return res.status(404).json({ 'error': 'Couldn\'t fetch any doctor' })
                }
                return res.status(200).json(doctors);
            })
            .catch(error => {
                return next(error);
            })
                      
        });
    app.route('/doctors/:id')
        .get(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            const doctorId = req.params.id;
            db.user.findOne({ 
                attributes: [ 'first_name', 'last_name', 'email', 'profession' ],
                where: { id: { [Op.eq]: doctorId }, rol_id: { [Op.eq]: '1' }}
            })
            .then(doctor => {
                if (!doctor) {
                    return res.status(404).json({ 'error': 'Doctor not found' })
                }
                return res.status(200).json(doctor);
            })
            .catch(error => {
                return next(error);
            })
        })
}