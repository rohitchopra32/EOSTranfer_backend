/**
 * Payment Model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var paymentSchema = new Schema({
    userName:{type:String},
    address:{Type:String},
    transactionId:{type:String},
    status:{type:String},
    txnId:{type:String},
    confirmsNeeded:{type:String},
    timeout:{type:String},
    statusUrl:{type:String},
    qrcodeUrl:{type:String},
    amount:{type:String},
    currency:{type:String},
    transactionHash:{type:String}

},{
    timestamps:{createdAt:'createdAt', lastUpdated:'lastUpdated'}
});

module.exports = mongoose.model('payment', paymentSchema);
