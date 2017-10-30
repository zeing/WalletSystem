'use strict';

const   Hashids = require('hashids'),
    Sequelize = require('sequelize'),
    log4js  = require("log4js"),
    moment = require("moment-timezone"),
    logger = log4js.getLogger("DATACTRL");

logger.level = "ALL";

const   hashids = []


const  connection = new Sequelize({
    host: "localhost",
    username : "root",
    database : 'ooca',
    dialect: 'mysql',
    pool: {
        max: 30,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false
    },
});

connection.sync();

const   Wallet = require("../models/wallet")(connection,Sequelize),
        Transaction = require("../models/wallet_transaction")(connection,Sequelize)


// Adds foreignKey to appointments



module.exports = {
    Connection : connection,
    Wallet : Wallet,
    Transaction : Transaction
};
