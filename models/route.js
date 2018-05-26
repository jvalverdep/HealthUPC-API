module.exports = function(sequelize, Sequelize) {
    const route = sequelize.define('route', {
        abbreviation: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        definition: {
            type: Sequelize.STRING(100),
            allowNull: false
        }
    });

    route.associate = function(models) {
        models.route.hasMany(models.treatment_detail);
    }
    return route;
}