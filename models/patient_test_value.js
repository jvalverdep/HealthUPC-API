module.exports = function(sequelize, Sequelize) {
    const patient_test_value = sequelize.define('patient_test_value', {
        value: {
            type: Sequelize.STRING(25),
            allowNull: false
        }
    });

    patient_test_value.associate = function(models) {
        models.patient_test_value.belongsTo(models.patient_test);
        models.patient_test_value.belongsTo(models.test_field);
    }
    return patient_test_value;
}