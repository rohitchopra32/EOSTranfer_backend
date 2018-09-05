var express = require('express');
var app = express();
module.exports= {
    db:{
        uri:'mongodb://localhost:27017/eosTransfer',
    },
    prodDb:{
        uri:'mongodb://localhost:27017/eosTransfer',
    }   
}