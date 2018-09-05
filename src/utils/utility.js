/**
 * utility : CONSTANT METHODS OR THIRD PARTY API
 */
const env = require('./env');
const request = require('request');
const Eos = require('eosjs');
var Coinpayments = require('coinpayments');

// Initialization of coinPayment
var options = {
    key : env.coinKey,
    secret : env.coinSecretKey,
    autoIpn : env.coinAutoIpn,
    ipnTime : env.coinIpnTime,
}
var client = new Coinpayments(options); 

// Configuration to create Account on block chai
var eos = Eos(env.config);

// GET ACCOUNT DETAILS OF A USER BY ACCOUNT NAME
exports.getAccountDetails = (data, callback)=>{
    let body = {
        "account_name":data
    }
    body = JSON.stringify(body);
    const options = {
        method:'POST',
        url:env.basePath + '/v1/chain/get_account',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/x-www-form-urlencoded',
        },
        body:body
    };
    request(options, (error, response, body)=>{
        if(error){
            console.log('error in ');
            callback(error);
        }
        else{
            console.log('response in');
            callback(null, response);
        }
    });
}

exports.convertUSDtoCoins = (data, callback)=>{
    console.log('USD = ', env.coinPath+"fsym="+data.from+"&tsyms="+data.to);
    const options = {
        method:'GET',
        url:env.coinPath+"fsym="+data.from+"&tsyms="+data.to,
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };
    request(options, (err , res)=>{
        console.log('in err ', err)
        if(err){
            callback(err);
        }
        else{
            callback(null, res);
        }
    })
}

exports.createTransaction = (data, callback) =>{
    client.createTransaction({
        'currency1' : 'USD', 
        'currency2' : data.currency,
        'amount' : env.fixedAmount,
        'buyer_name' : data.name,

    },function(err,result){
        if(err){
            callback(err);
        }
        else{
            callback(null, result);
        }
    });
}

exports.newAccount = async (data, callback) =>{
    try{
        let result = await eos.transaction(tr => {
            tr.newaccount({
              creator: env.creater,
              name: data.account_name,
              owner: data.publicKey,
              active: data.publicKey,
            })
            tr.buyrambytes({
              payer: env.creater,
              receiver: data.account_name,
              bytes: 4000,
            })
            tr.delegatebw({
              from: env.creater,
              receiver: data.account_name,
              stake_net_quantity: '10.0000 EOS',
              stake_cpu_quantity: '10.0000 EOS',
              transfer: 0,
            })
        });
        console.log('result = ', result);
        callback(null, result);
    }catch(err){
        console.log('in err ');
        callback(err);
    }
}
exports.base58 =(function(alpha) {
    var alphabet = alpha || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
        base = alphabet.length;
    return {
        encode: function(enc) {
            if(typeof enc!=='number' || enc !== parseInt(enc))
                throw '"encode" only accepts integers.';
            var encoded = '';
            while(enc) {
                var remainder = enc % base;
                enc = Math.floor(enc / base);
                encoded = alphabet[remainder].toString() + encoded;        
            }
            return encoded;
        },
        decode: function(dec) {
            if(typeof dec!=='string')
                throw '"decode" only accepts strings.';            
            var decoded = 0;
            while(dec) {
                var alphabetPosition = alphabet.indexOf(dec[0]);
                if (alphabetPosition < 0)
                    throw '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"';
                var powerOf = dec.length - 1;
                decoded += alphabetPosition * (Math.pow(base, powerOf));
                dec = dec.substring(1);
            }
            return decoded;
        }
    };
})();