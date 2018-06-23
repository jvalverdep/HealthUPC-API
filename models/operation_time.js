module.exports = function(sequelize, Sequelize) {
    const operation_time = sequelize.define('operation_time', {
        start: {
            type: Sequelize.DATE,
            allowNull: false
        },
        end: {
            type: Sequelize.DATE,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    operation_time.associate = function(models) {
        models.operation_time.belongsToMany(models.user, { through:'doctor_operation_time', onDelete: 'cascade', foreignKey: 'operation_time_id' });
    }
    return operation_time;
}