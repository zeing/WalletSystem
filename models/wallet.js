'use strict';


module.exports = function(sequelize, DataTypes) {
    return sequelize.define('wallets', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        balance: {
            type: DataTypes.DECIMAL(11,2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                isDecimal : true
            }
        },
        active : {
            type : DataTypes.INTEGER(1),
            allowNull : false,
            defaultValue :  1
        }
    }, {
        tableName: 'wallets',
        timestamps: true,
        underscored: true
    });
};
