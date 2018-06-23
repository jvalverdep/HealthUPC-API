const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || "development";
const config = require('../config').db[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
    define: {
        underscored: true
    },
    // dialectOptions: {
    //     multipleStatements: true
    // }
    timezone: '-05:00'
});

const basename = path.basename(__filename);

let db = {};

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize.import((path.join(__dirname, file)));
        db[model.name] = model;
        console.log(`Model <${model.name}> registered`);
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.sync({ force: false });

db.rol.count().then(n => {
    if (n == 0) {
        db.rol.create({ name: 'Doctor' });
        db.rol.create({ name: 'Patient' });
    }
});

db.frequency.count().then(n => {
    if (n == 0) {
        db.frequency.create({ abbreviation: 'q.d.', definition: 'Once a day' });
        db.frequency.create({ abbreviation: 'b.i.d.', definition: 'Twice a day' });
        db.frequency.create({ abbreviation: 't.i.d.', definition: 'Three times a day' });
        db.frequency.create({ abbreviation: 'q.i.d.', definition: 'Four times a day' });
        db.frequency.create({ abbreviation: 'q.h.s', definition: 'Before bed' });
        db.frequency.create({ abbreviation: '5X a day', definition: 'Five times a day' });
        db.frequency.create({ abbreviation: 'q.4h', definition: 'Every four hours' });
        db.frequency.create({ abbreviation: 'q.6h', definition: 'Every six hours' });
        db.frequency.create({ abbreviation: 'q.o.d', definition: 'Every other day' });
        db.frequency.create({ abbreviation: 'prn.', definition: 'as needed' });
    }
});

db.route.count().then(n => {
    if (n == 0) {
        db.route.create({ abbreviation: 'p.o.', definition: 'Orally' });
        db.route.create({ abbreviation: 'I.M.', definition: 'Intramuscularly' });
        db.route.create({ abbreviation: 'Subq.', definition: 'Subcutaneous' });
        db.route.create({ abbreviation: 'Rectally', definition: 'Rectally' });
        db.route.create({ abbreviation: 'I.V.', definition: 'Intravenous' });
        db.route.create({ abbreviation: 'O.D.', definition: 'In the right eye' });
        db.route.create({ abbreviation: 'O.S.', definition: 'In the left eye' });
        db.route.create({ abbreviation: 'O.U.', definition: 'In both eyes' });
    }
});

db.user.count().then(n => {
    if (n == 0) {
        db.user.create({ id: 1, first_name: 'Daniela', last_name: 'Fuller', email: 'danibu@gmail.com', password: 'password', rol_id: 2 });
        db.user.create({ id: 2, first_name: 'Javier', last_name: 'Sotomayor', profession: 'Endocrinologist', email: 'jsotomayor@gmail.com', password: 'password', rol_id: 1 });
        db.user.create({ id: 3, first_name: 'Jose', last_name: 'Chunga', profession: 'Endocrinologist', email: 'jchunga@gmail.com', password: 'password', rol_id: 1 });
        db.medical_record.create({ id: 1, birthday: '1995-09-30', height: 1.70, weight: 72.0, notes: 'some notes for Daniela', user_id: 1 });
    }
});

db.operation_time.count().then(n => {
    if (n == 0) {
        // Monday
        db.operation_time.create({ id: 1, start: '2018-06-25 08:00:00', end: '2018-06-25 09:00:00' });
        db.operation_time.create({ id: 2, start: '2018-06-25 09:30:00', end: '2018-06-25 10:30:00' });
        db.operation_time.create({ id: 3, start: '2018-06-25 11:00:00', end: '2018-06-25 12:00:00' });
        db.operation_time.create({ id: 4, start: '2018-06-25 12:30:00', end: '2018-06-25 13:30:00' });
        db.operation_time.create({ id: 5, start: '2018-06-25 15:00:00', end: '2018-06-25 16:00:00' });
        db.operation_time.create({ id: 6, start: '2018-06-25 16:30:00', end: '2018-06-25 17:30:00' });
        db.operation_time.create({ id: 7, start: '2018-06-25 18:00:00', end: '2018-06-25 19:00:00' });
        db.operation_time.create({ id: 8, start: '2018-06-25 19:30:00', end: '2018-06-25 20:30:00' });
        // Tuesday
        db.operation_time.create({ id: 9, start: '2018-06-26 08:00:00', end: '2018-06-26 09:00:00' });
        db.operation_time.create({ id: 10, start: '2018-06-26 09:30:00', end: '2018-06-26 10:30:00' });
        db.operation_time.create({ id: 11, start: '2018-06-26 11:00:00', end: '2018-06-26 12:00:00' });
        db.operation_time.create({ id: 12, start: '2018-06-26 12:30:00', end: '2018-06-26 13:30:00' });
        db.operation_time.create({ id: 13, start: '2018-06-26 15:00:00', end: '2018-06-26 16:00:00' });
        db.operation_time.create({ id: 14, start: '2018-06-26 16:30:00', end: '2018-06-26 17:30:00' });
        db.operation_time.create({ id: 15, start: '2018-06-26 18:00:00', end: '2018-06-26 19:00:00' });
        db.operation_time.create({ id: 16, start: '2018-06-26 19:30:00', end: '2018-06-26 20:30:00' });
        // Wednesday
        db.operation_time.create({ id: 17, start: '2018-06-27 08:00:00', end: '2018-06-27 09:00:00' });
        db.operation_time.create({ id: 18, start: '2018-06-27 09:30:00', end: '2018-06-27 10:30:00' });
        db.operation_time.create({ id: 19, start: '2018-06-27 11:00:00', end: '2018-06-27 12:00:00' });
        db.operation_time.create({ id: 20, start: '2018-06-27 12:30:00', end: '2018-06-27 13:30:00' });
        db.operation_time.create({ id: 21, start: '2018-06-27 15:00:00', end: '2018-06-27 16:00:00' });
        db.operation_time.create({ id: 22, start: '2018-06-27 16:30:00', end: '2018-06-27 17:30:00' });
        db.operation_time.create({ id: 23, start: '2018-06-27 18:00:00', end: '2018-06-27 19:00:00' });
        db.operation_time.create({ id: 24, start: '2018-06-27 19:30:00', end: '2018-06-27 20:30:00' });
        // Thursday
        db.operation_time.create({ id: 25, start: '2018-06-28 08:00:00', end: '2018-06-28 09:00:00' });
        db.operation_time.create({ id: 26, start: '2018-06-28 09:30:00', end: '2018-06-28 10:30:00' });
        db.operation_time.create({ id: 27, start: '2018-06-28 11:00:00', end: '2018-06-28 12:00:00' });
        db.operation_time.create({ id: 28, start: '2018-06-28 12:30:00', end: '2018-06-28 13:30:00' });
        db.operation_time.create({ id: 29, start: '2018-06-28 15:00:00', end: '2018-06-28 16:00:00' });
        db.operation_time.create({ id: 30, start: '2018-06-28 16:30:00', end: '2018-06-28 17:30:00' });
        db.operation_time.create({ id: 31, start: '2018-06-28 18:00:00', end: '2018-06-28 19:00:00' });
        db.operation_time.create({ id: 32, start: '2018-06-28 19:30:00', end: '2018-06-28 20:30:00' });
        // Friday
        db.operation_time.create({ id: 33, start: '2018-06-29 08:00:00', end: '2018-06-29 09:00:00' });
        db.operation_time.create({ id: 34, start: '2018-06-29 09:30:00', end: '2018-06-29 10:30:00' });
        db.operation_time.create({ id: 35, start: '2018-06-29 11:00:00', end: '2018-06-29 12:00:00' });
        db.operation_time.create({ id: 36, start: '2018-06-29 12:30:00', end: '2018-06-29 13:30:00' });
        db.operation_time.create({ id: 37, start: '2018-06-29 15:00:00', end: '2018-06-29 16:00:00' });
        db.operation_time.create({ id: 38, start: '2018-06-29 16:30:00', end: '2018-06-29 17:30:00' });
        db.operation_time.create({ id: 39, start: '2018-06-29 18:00:00', end: '2018-06-29 19:00:00' });
        db.operation_time.create({ id: 40, start: '2018-06-29 19:30:00', end: '2018-06-29 20:30:00' });
    }
})


db.doctor_operation_time.count().then(n => {
    if (n == 0) {
        db.doctor_operation_time.create({ id: 1, operation_time_id: 1, doctor_id: 2 });
        db.doctor_operation_time.create({ id: 2, operation_time_id: 3, doctor_id: 2 });
        db.doctor_operation_time.create({ id: 3, operation_time_id: 9, doctor_id: 2 });
        db.doctor_operation_time.create({ id: 4, operation_time_id: 11, doctor_id: 2 });
        db.doctor_operation_time.create({ id: 5, operation_time_id: 17, doctor_id: 2 });
        db.doctor_operation_time.create({ id: 6, operation_time_id: 19, doctor_id: 2 });
        db.doctor_operation_time.create({ id: 7, operation_time_id: 25, doctor_id: 2 });
        db.doctor_operation_time.create({ id: 8, operation_time_id: 27, doctor_id: 2 });
        db.doctor_operation_time.create({ id: 9, operation_time_id: 33, doctor_id: 2 });
        db.doctor_operation_time.create({ id: 10, operation_time_id: 35, doctor_id: 2 });
        
        db.doctor_operation_time.create({ id: 11, operation_time_id: 1, doctor_id: 3 });
        db.doctor_operation_time.create({ id: 12, operation_time_id: 3, doctor_id: 3 });
        db.doctor_operation_time.create({ id: 13, operation_time_id: 9, doctor_id: 3 });
        db.doctor_operation_time.create({ id: 14, operation_time_id: 11, doctor_id: 3 });
    }
});

// // APPOINTMENTS
db.appointment.count().then(n => {
    if (n == 0) {
        db.appointment.create({
            id: 1,
            patient_id: 1,
            dot: 1,
            height: null,
            weight: null,
            glucotest: null,
            reason: 'No reason',
            notes: 'Some notes'
        });
        db.appointment.create({
            id: 2,
            patient_id: 1,
            dot: 2,
            height: null,
            weight: null,
            glucotest: null,
            reason: 'No reason',
            notes: 'Some notes'
        });
    }
});

// // TREATMENTS
db.treatment.count().then(n => {
    if (n == 0) {
        db.treatment.create({
            id: 1,
            appointment_id: 1,
            notes: 'Some notes for appointment_id: 1'
        });
        db.treatment.create({
            id: 2,
            appointment_id: 2,
            notes: 'Some notes for appointment_id: 2'
        });
    }
});

// // TREATMENT DETAILS
db.treatment_detail.count().then(n => {
    if (n == 0) {
        db.treatment_detail.create({
            id: 1,
            task: 'Take 2 pills',
            compliance: '00000000',
            frequency_id: 2,
            route_id: 2,
            treatment_id: 1
        });
        db.treatment_detail.create({
            id: 2,
            task: 'Take 3 pills',
            compliance: '000000000000',
            frequency_id: 2,
            route_id: 2,
            treatment_id: 1
        });
        db.treatment_detail.create({
            id: 3,
            task: 'Take 1 pill',
            compliance: '0000',
            frequency_id: 2,
            route_id: 2,
            treatment_id: 2
        });
        db.treatment_detail.create({
            id: 4,
            task: 'Take 2 pills',
            compliance: '00000000',
            frequency_id: 2,
            route_id: 2,
            treatment_id: 2
        });
    }
});



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


