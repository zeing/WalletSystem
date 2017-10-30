const express = require('express');
const router = express.Router(),
    moment = require('moment-timezone')


const sequelizeManage = require('./sequelizeManage'),
    connection = sequelizeManage.Connection
const Decimal = require('decimal.js');


const Wallet = sequelizeManage.Wallet,
    Transaction = sequelizeManage.Transaction

//
// router.param('id', function(req, res, next, id) {
//     connection.transaction()
//         .then(function (transaction) {
//             var option = {
//                 include: [{all: true}],
//                 transaction: transaction
//             }
//             Wallet.findById(id, {
//                 include: [{ all: true }],
//                 transaction: transaction,
//                 // lock: transaction.LOCK.SHARE
//             })
//                 .then(function (wallet) {
//                     req.transaction = transaction
//                     if (!wallet) res.sendStatus(404);
//                     else {
//                         req.wallet = wallet;
//                         next();
//                     }
//                 })
//         })
//         .catch(function (err) {
//
//         });
// });

// router.get('/wallet/:id', function(req, res, next) {
//     res.send(req.wallet)
//     req.transaction.commit()
// });

router.get('/wallet/:id', function(req, res, next) {
    connection.transaction(function (transaction) {
        var id = req.params.id;
        return Wallet.findById(id, {
            include: [{ all: true }],
            transaction : transaction,
            lock: transaction.LOCK.SHARE
        })
    })
        .then(function(wallet){
            if(wallet)
                res.send(wallet)
            else res.send({error : "wallet not found"})
        })
        .catch(function (err) {
            res.send(err)
        })

});


router.post('/wallet', function(req, res, next) {
    connection.transaction(function (t) {
        return Wallet.create({},{transaction: t})
            .then(function(newWallet) {
                return Transaction.create({
                    transaction_number: "TRX"+moment.tz('UTC').unix(),
                    wallet_id : newWallet.id,
                    type : 'create',
                    amount : 0,
                    balance : 0,
                    by : 1 // get id user from token
                }, {transaction: t})
                .then(function () {
                    return newWallet
                })
            })
    })
        .then(function (result) {
            res.send(result)
        })
        .catch(function (err) {
            res.send(err)
        })
});


router.patch('/wallet/:id', function(req, res, next) {

    connection.transaction(function(transaction) {
        var id = req.params.id
        return Wallet.findById(id, {
            include: [{all: true}],
            transaction : transaction,
            lock : transaction.LOCK.UPDATE
        })
            .then(function (wallets) {
                if(!wallets)
                    return {error : "wallet not found"}
                const wallet = JSON.parse(JSON.stringify(wallets))
                var newWallet = new Decimal(wallet.balance)
                var amount = new Decimal(req.body.amount)
                switch (req.body.type) {
                    case 'deposit' : {
                        newWallet = newWallet.plus(amount).toNumber()
                    }
                        break;
                    case 'withdraw' : {
                        newWallet = newWallet.minus(amount).toNumber()
                    }
                        break;
                    case 'trans' : {
                        newWallet -= req.body.amount
                    }
                    default : {
                        return {error: "type is invalid"}
                    }
                        break;
                }
                return wallets.update({
                    balance: newWallet
                },{transaction : transaction})
                    .then(function (updateWallet) {
                        return updateWallet
                    })
                    .catch(function (err) {
                        return err
                    })
            })
    })
        .then(function (updateWallet) {//
            res.send(updateWallet)
        })
        .catch(function (err) {
            res.send(err)
        })

});

module.exports = router;
