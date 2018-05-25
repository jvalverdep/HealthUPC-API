module.exports = function(sequelize, Sequelize) {
    const frequency = sequelize.define('frequency', {
        frequency: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    frequency.associate = function(models) {
        models.frequency.hasMany(models.treatment_detail);
    }
    return frequency;
}