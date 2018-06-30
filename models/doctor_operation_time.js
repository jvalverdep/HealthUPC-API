module.exports = function(sequelize, Sequelize) {
    const doctor_operation_time = sequelize.define('doctor_operation_time', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        timestamps: false
    });
    doctor_operation_time.associate = function(models) {
        models.doctor_operation_time.belongsTo(models.user, {  as: 'doctor', onDelete: 'cascade', foreignKey: 'doctor_id' });
    }

    return doctor_operation_time;
}