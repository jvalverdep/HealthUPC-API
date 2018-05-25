module.exports = function(sequelize, Sequelize) {
    const patient_test = sequelize.define('patient_test', {
        
    });

    patient_test.associate = function(models) {
        models.patient_test.hasMany(models.patient_test_value, { onDelete: 'cascade' });
        models.patient_test.belongsTo(models.test);
    }
    return patient_test;
}