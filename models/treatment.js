module.exports = function(sequelize, Sequelize) {
    const treatment = sequelize.define('treatment', {
        appointment_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });

    treatment.associate = function(models) {
        // models.treatment.hasOne(models.appointment);
        models.treatment.hasMany(models.treatment_detail, { onDelete: 'cascade' });
    }
    return treatment;
}