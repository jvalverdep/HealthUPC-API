module.exports = function(sequelize, Sequelize) {
    const frequency = sequelize.define('frequency', {
        abbreviation: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        definition: {
            type: Sequelize.STRING(100),
            allowNull: false
        }
    });

    frequency.associate = function(models) {
        models.frequency.hasMany(models.treatment_detail);
    }
    return frequency;
}