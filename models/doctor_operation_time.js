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
    
    return doctor_operation_time;
}