const bcrypt = require('bcrypt');

module.exports = function(sequelize, Sequelize) {
    const user = sequelize.define('user', {
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        profession: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set(val) {
                this.setDataValue('password', bcrypt.hashSync(val, 12));
            }
        },
        active_flag: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    });

    user.prototype.comparePassword = function(candidatePassword, callback) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) { return callback(err); }

            callback(null, isMatch);
        });
    }

    user.associate = function(models) {
        models.user.belongsTo(models.rol);
        models.user.hasOne(models.medical_record, { onDelete: 'cascade', foreignKey: 'user_id' });
        models.user.hasMany(models.appointment, { as: 'appointments', onDelete: 'cascade', foreignKey: 'patient_id' });
        models.user.hasMany(models.patient_test, { as: 'requested_for', onDelete: 'cascade', foreignKey: 'doctor_id' });
        models.user.hasMany(models.patient_test, { as: 'tests', onDelete: 'cascade', foreignKey: 'patient_id' });
        models.user.belongsToMany(models.operation_time, { through:'doctor_operation_time', as: 'operation_times', onDelete: 'cascade', foreignKey: 'doctor_id' });
    }
    return user;
}