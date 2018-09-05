/**
 * env : constants
 */
var express = require('express');
var app = express();


//keys for development
if(app.get('env')==='local' || app.get('env')==='development'){

    var basePath = 'http://139.162.58.41:8888'; //jungle

    var chainId= "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"; // 32 byte (64 char) hex string
    // var privateKey= "5JtiUFrViqvXe8HmsJSE4hAtxoF7ZwWVWNbkjMnorjULdDUi9SM" ; // pooja
    var privateKey= "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3" ; // prasanjit sir
    var creater = "pooja"; //account name from which account will be create
    var walletAddress="0x5faddAb6Fb3F9D32c81C33eb6Fe87fFf247F7b46"
    
    var config = {
        chainId: chainId,
        keyProvider: [privateKey], // WIF string or array of keys..
        httpEndpoint: basePath,
        expireInSeconds: 60,
        broadcast: true,
        verbose: false, // API activity
        sign: true
    }

    //COIN PAYMENT INFORMATION

    var fixedAmount = 1; // 15$
    var fromCurrency='USD';
    var toCurrency = "BTC,ETH";

    var coinKey = "a607b5b06463fdb8ab760f273229cbfa6180f68f2ce224212b76e276d7ffdc9a";
    var coinSecretKey = "C01121664d3654D3c9a581915711401546447ea185ee424A9f30505d1929F471"; 
    var coinAutoIpn = true; //optional
    var coinIpnTime = 30;   //optional

    //path for USD to other coins
    var coinPath = "https://min-api.cryptocompare.com/data/price?";
}

//keys for production
if(app.get('env')==='production'){
    
}

module.exports={
    chainId:chainId,
    privateKey:privateKey,
    basePath:basePath,
    config:config,
    fixedAmount:fixedAmount,
    coinPath:coinPath,
    fromCurrency:fromCurrency,
    toCurrency:toCurrency,
    coinKey:coinKey,
    coinSecretKey:coinSecretKey,
    coinAutoIpn:coinAutoIpn,
    coinIpnTime:coinIpnTime,
    creater:creater,
    walletAddress:walletAddress
};