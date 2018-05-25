module.exports = function(sequelize, Sequelize) {
    const rol = sequelize.define('rol', {
        name: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        }
    });

    rol.associate = function(models) {
        models.rol.hasMany(models.user, { onDelete: 'cascade' });
    }
    return rol;
}