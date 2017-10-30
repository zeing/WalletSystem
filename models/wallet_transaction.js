'use strict';


module.exports = function(sequelize, DataTypes) {
    return sequelize.define('wallets_transaction', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        transaction_number : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        wallet_id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'wallets',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.ENUM('create', 'withdraw','deposit','transfer'),
            allowNull: false,
        },
        by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount : {
            type: DataTypes.DECIMAL(11,2),
            allowNull: true,
            validate: {
                isDecimal : true
            }
        },
        balance : {
            type: DataTypes.DECIMAL(11,2),
            allowNull: false,
            defaultValue : 0,
            validate: {
                isDecimal : true
            }
        },
        note : {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        tableName: 'wallets_transaction',
        timestamps: true,
        underscored: true
    });
};
