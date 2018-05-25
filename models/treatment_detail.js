module.exports = function(sequelize, Sequelize) {
    const treatment_detail = sequelize.define('treatment_detail', {
        task: {
            type: Sequelize.STRING,
            allowNull: false
        },
        compliance: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    treatment_detail.associate = function(models) {
        models.treatment_detail.belongsTo(models.treatment);
        models.treatment_detail.belongsTo(models.frequency);
    }
    return treatment_detail;
}