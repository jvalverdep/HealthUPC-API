module.exports = function(sequelize, Sequelize) {
    const doctor_operation_time = sequelize.define('doctor_operation_time', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        available: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        timestamps: false
    });
    doctor_operation_time.associate = function(models) {
        models.doctor_operation_time.belongsTo(models.user, {  as: 'doctor', onDelete: 'cascade', foreignKey: 'doctor_id' });
        models.doctor_operation_time.belongsTo(models.operation_time, {  as: 'operation_time', onDelete: 'cascade', foreignKey: 'operation_time_id' });
    }

    return doctor_operation_time;
}