const lodash = require('lodash');

function isInt(value) {
    return value !== null && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

module.exports = function(app) {
    app.route('/doctors/work_hours')
        .post(async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;

            const startTime = req.body.start;
            const endTime = req.body.end;
            const doctorId = req.body.doctor_id;

            if (!doctorId && !startTime && !endTime) {
                return res.json({ 'error': 'Empty fields: doctor_id, start, end. Should be in format: yyyy-MM-dd hh:mm:ss' });
            }
            
            db.user.findById(doctorId)
                .then(doctor => {
                    if (doctor) {
                        db.operation_time.findOrCreate({ where: { start: { [Op.eq]: startTime}, end: { [Op.eq]: endTime}}, defaults: { start: startTime, end: endTime }})
                            .spread(async (operationTime, created) => {
                                await doctor.addOperation_times(operationTime);
                                return res.status(201).json({ 'success': 'created' });
                            })
                            .catch(error => {
                                return res.status(200).json({ 'error': error });
                            })
                    } else {
                        return res.status(200).json({ 'error': 'Couldn\'t find doctor.' });
                    }
                })
                .catch(error => {
                    return res.status(200).json({ 'error': error });
                })
        });
    app.route('/doctors')
        .get(async (req, res, next) => {
            const db = req.app.db;
            const sequelize = db.sequelize;
            const query = req.query;
            if ( !query.hasOwnProperty('d') ) {
                next();
                return;
            }
            sequelize.query('CALL sp_getDoctorsWorkHoursByDay(?)', { replacements: [query.d], type: sequelize.QueryTypes.SELECT })
            .spread((results, _) => {
                return Object.keys(results).length !== 0 ? res.status(200).json(lodash.values(results)) : res.status(404).json({ 'error': 'Couldn\'t fetch any doctor' });
            }).catch((error) => {
                return res.status(500).json({ 'error': error.message });
            });
        }, async (req, res, next) => {
            const db = req.app.db;
            const Op = db.Sequelize.Op;
            db.user.findAll({ 
                attributes: [ 'id', 'first_name', 'last_name', 'email', 'profession' ],
                include: { model: db.operation_time, as: 'operation_times' },
                where: { rol_id: { [Op.eq]: 1 }}
            })
            .then(doctors => {
                if (doctors.length <= 0) {
                    return res.status(404).json({ 'error': 'Couldn\'t fetch any doctor' });
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
            if (!isInt(doctorId)) {
                next();
                return;
            }
            db.user.findOne({ 
                attributes: [ 'id', 'first_name', 'last_name', 'email', 'profession' ],
                include: { model: db.operation_time, as: 'operation_times' },
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