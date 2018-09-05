/**
 * User Model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name:{type:String},
    ownerKey:{type:String},
    activeKey:{type:String}
},{
    timestamps:{createdAt:'createdAt', lastUpdated:'lastUpdated'}
});

module.exports = mongoose.model('user', userSchema);
