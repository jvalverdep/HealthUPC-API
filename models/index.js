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
})

db.frequency.count().then(n => {
    if (n == 0) {
        db.frequency.create({ frequency: 'Daily' });
        db.frequency.create({ frequency: 'Weekly' });
        db.frequency.create({ frequency: 'Monthly' });
    }
})
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


