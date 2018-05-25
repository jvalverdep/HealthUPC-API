module.exports = function(sequelize, Sequelize) {
    const appointment = sequelize.define('appointment', {
        patient_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        doctor_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        height: {
            type: Sequelize.DECIMAL(3,2),
            allowNull: true
        },
        weight: {
            type: Sequelize.DECIMAL(5,2),
            allowNull: true
        },
        glucotest: {
            type: Sequelize.DECIMAL(5,2),
            allowNull: true
        },
        scheduled: {
            type: Sequelize.DATE,
            allowNull: false
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });

    appointment.associate = function(models) {
        models.appointment.hasOne(models.treatment, { onDelete: 'cascade', foreignKey: 'appointment_id' });
    }
    return appointment;
}