module.exports = function(sequelize, Sequelize) {
    const test = sequelize.define('test', {
        name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        }
    });

    test.associate = function(models) {
        models.test.hasMany(models.test_field, { onDelete: 'cascade' });
        models.test.hasMany(models.patient_test, { onDelete: 'cascade' });
    }
    return test;
}