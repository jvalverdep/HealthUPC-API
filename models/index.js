const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname,'../', 'config.json'))[env];

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
    define: {
        underscored: true
    }
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
        db.user.create({ first_name: 'Daniela', last_name: 'Fuller', email: 'danibu@gmail.com', password: 'password', rol_id: 2 });
        db.user.create({ first_name: 'Javier', last_name: 'Sotomayor', profession: 'Endocrinologist', email: 'jsotomayor@gmail.com', password: 'password', rol_id: 1 });
    }
});

db.medical_record.count().then(n => {
    if (n == 0) {
        db.medical_record.create({ birthday: '1995-09-30', height: 1.70, weight: 72.0, notes: 'some notes for Daniela', user_id: 1 });
    }
});

db.appointment.count().then(n => {
    if (n == 0) {
        db.appointment.create({ 
            patient_id: 1,
            doctor_id: 2,
            height: null,
            weight: null,
            glucotest: null,
            scheduled: '2018-07-03',
            notes: 'Some notes for appointment with patient_id =1, doctor_id=2'
        });
        db.appointment.create({ 
            patient_id: 1,
            doctor_id: 2,
            height: null,
            weight: null,
            glucotest: null,
            scheduled: '2018-09-12',
            notes: 'Some notes for appointment with patient_id =1, doctor_id=2 2'
        });
    }
});

db.treatment.count().then(n => {
    if (n == 0) {
        db.treatment.create({ 
            appointment_id: 1,
            notes: 'Some notes for appointment_id: 1'
        });
        db.treatment.create({ 
            appointment_id: 2,
            notes: 'Some notes for appointment_id: 2'
        });
    }
});

db.treatment_detail.count().then(n => {
    if (n == 0) {
        db.treatment_detail.create({
            task: 'Take 2 pills',
            compliance: '00000000',
            frequency_id: 2,
            route_id: 2,
            treatment_id: 1
        });
        db.treatment_detail.create({
            task: 'Take 3 pills',
            compliance: '000000000000',
            frequency_id: 2,
            route_id: 2,
            treatment_id: 1
        });
        db.treatment_detail.create({
            task: 'Take 1 pill',
            compliance: '0000',
            frequency_id: 2,
            route_id: 2,
            treatment_id: 2
        });
        db.treatment_detail.create({
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


