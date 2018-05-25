module.exports = function(sequelize, Sequelize) {
    const medical_record = sequelize.define('medical_record', {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        birthday: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        height: {
            type: Sequelize.DECIMAL(3,2),
            allowNull: true
        },
        weight: {
            type: Sequelize.DECIMAL(5,2),
            allowNull: true
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });

    medical_record.associate = function(models) {
        
    }
    return medical_record;
}