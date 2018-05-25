module.exports = function(sequelize, Sequelize) {
    const test_field = sequelize.define('test_field', {
        field: {
            type: Sequelize.STRING(25),
            allowNull: false
        }
    });

    test_field.associate = function(models) {
        models.test_field.hasMany(models.patient_test_value, { onDelete: 'cascade' });
        models.test_field.belongsTo(models.test);
    }
    return test_field;
}