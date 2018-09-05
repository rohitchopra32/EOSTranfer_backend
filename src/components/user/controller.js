
/**
 * User Controller
 */
const utility = require("../../utils/utility");
const env = require("../../utils/env");
const code = require("../../utils/statusCode");
const userModel = require("./model");
const paymentModel = require("../payment/model");
const EOS = require('eosjs');
const ecc = require('eosjs-ecc');
const axios = require('axios');
var moment = require('moment');

var eos=EOS(env.config);
var userController = {};

userController.nameAlreadyExist = (req, res) => {
  console.log("createAcount", req.body);
  if (req.body.name.length === 12) {
    console.log("calling");
    userModel.findOne({ name: req.body.name }, (err, userData) => {
      if (err) {
        res.status(code.internal).send(err);
      } else if (userData) {
        res.status(code.found).send({ data: "Already exist" });
      } else {
        utility.getAccountDetails(req.body.name, (err, data) => {
          if (err) {
            res.send(err);
          } else if (data.statusCode === 500) {
            res.status(code.ok).send({ data: "Success" });
          } else {
            res.status(code.found).send({ data: "Already exist" });
          }
        });
      }
    });
  } else {
    res.status(code.bad).send({ err: "Incomplete Parameters!" });
  }
};

userController.getPayAmount = (req, res) => {
  let data = {
    from: env.fromCurrency,
    to: env.toCurrency
  };
  utility.convertUSDtoCoins(data, (err, result) => {
    if (err) {
      console.log("in err");
      res.status(code.internal).send({ err: err });
    } else if (result) {
      console.log("find result = ");
      let _result = JSON.parse(result.body);
      let data = {
        BTC: parseFloat(_result.BTC * env.fixedAmount).toFixed(6),
        ETH: parseFloat(_result.ETH * env.fixedAmount).toFixed(6),
        UNIT_AMOUNT: env.fixedAmount,
        SEND_TO: env.walletAddress
      };
      res.status(code.ok).send(data);
    } else {
      console.log("result not fount = ");
      res.status(code.notFound).send({ err: "NOT FOUND!" });
    }
  });
};

userController.currencyAmount = (req, res) => {
  console.log("req = ", req.body);
  if (
    req.body.name &&
    req.body.ownerKey &&
    req.body.activeKey &&
    req.body.currency
  ) {
    let data = {
      currency: req.body.currency,
      name: req.body.name
    };
    utility.createTransaction(data, (err, result) => {
      if (err) {
        console.log("in err createAccount");
        res.status(code.internal).send({ err: err });
      } else {
        console.log("in success createAccount");
        // res.status(code.ok).send({data:result});
        userModel.findOne({ name: req.body.name }, (err, findData) => {
          if (err) {
            res.status(code.internal).send({ err: err });
          } else if (findData) {
            res.status(code.found).send({ data: "Already exist" });
          } else {
            let _obj = {
              name: req.body.name,
              ownerKey: req.body.ownerKey,
              activeKey: req.body.activeKey
            };
            let user = new userModel(_obj);
            user.save((err, saveData) => {
              if (err) {
                res.status(code.internal).send({ err: err });
              } else {
                _obj = {};
                _obj = {
                  userName: req.body.name,
                  address: result.address,
                  status: "pending",
                  txnId: result.txn_id,
                  confirmsNeeded: result.confirms_needed,
                  timeout: result.timeout,
                  statusUrl: result.status_url,
                  qrcodeUrl: result.qrcode_url,
                  amount: result.amount
                };
                let payment = new paymentModel(_obj);
                payment.save((err, paymentData) => {
                  if (err) {
                    res.status(code.internal).send({ err: err });
                  } else {
                    let _sendData = {
                      address: result.address,
                      qrcodeUrl: result.qrcode_url,
                      amount: result.amount,
                      sendTo: env.walletAddress
                    };
                    res.status(code.ok).send({ data: _sendData });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.status(req.bad).send({ err: "Incomplete Parameters!" });
  }
};

userController.createAccount = (req, res) => {
  if (
    req.body.name &&
    req.body.ownerKey &&
    req.body.activeKey &&
    req.body.currency &&
    req.body.transactionHash
  ) {
    let _data = {
      account_name: req.body.name,
      publicKey: req.body.ownerKey
    };
    utility.newAccount(_data, (err, result) => {
      if (err) {
        console.log("err in new Account", err);
        res.status(code.internal).send({ err: err });
      } else {
        console.log("Account created Successfully!", result);

        userModel.findOne({ name: req.body.name }, (err, findData) => {
          if (err) {
            res.status(code.internal).send({ err: err });
          } else if (findData) {
            res.status(code.found).send({ data: "Already exist" });
          } else {
            let _obj = {
              name: req.body.name,
              ownerKey: req.body.ownerKey,
              activeKey: req.body.activeKey
            };
            let user = new userModel(_obj);
            user.save((err, saveData) => {
              if (err) {
                res.status(code.internal).send({ err: err });
              } else {
                _obj = {};
                _obj = {
                  userName: req.body.name,
                  status: "complete",
                  currency: req.body.currency,
                  transactionHash: req.body.transactionHash
                };
                let payment = new paymentModel(_obj);
                payment.save((err, paymentData) => {
                  if (err) {
                    res.status(code.internal).send({ err: err });
                  } else {
                    res.status(code.ok).send("Account created Successfully!");
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    res.status(code.bad).send({ err: "Incomplete Parameters!" });
  }

  // paymentModel.findOneAndUpdate(
  //   { userName: req.body.buyer_name},
  //   { $set: { status: "complete" } },
  //   (err, payData) => {
  //     if (err) {
  //       console.log("err in paymentModel");
  //       res.status(code.internal).send({ err: err });
  //     } else if (payData) {
  //       userModel.findOne({ name: req.body.buyer_name }, (err, data) => {
  //         if (err) {
  //           console.log("err in userModel");
  //           res.status(code.internal).send({ err: err });
  //         } else if (data) {
  //           let _data = {
  //             account_name: data.name,
  //             publicKey: data.ownerKey
  //           };
  //           utility.newAccount(_data, (err, result) => {
  //             if (err) {
  //               console.log("err in new Account", err);
  //               res.status(code.internal).send({ err: err });
  //             } else {
  //               console.log("Account created Successfully!");
  //               res.status(code.ok).send({ data: "Account created Successfully!"});
  //             }
  //           });
  //         } else {
  //           res.status(code.notFound).send({ err: "NOT FOUND!" });
  //         }
  //       });
  //     } else {
  //       res.status(code.bad).send({ err: "Incomplete Parameters!" });
  //     }
  //   }
  // );
};

userController.signWithMetaMask = async(req, res) => {
  console.log('body = ', req.body);
  let {name, publicKey, signature, ref_block_num, ref_block_prefix} = req.body;
  
  if (name && publicKey && signature && ref_block_num && ref_block_prefix) {

    // let info = await eos.getInfo({});

    // let block = await eos.getBlock(info.last_irreversible_block_num)

    console.log('date = ', moment().format());
    console.log("moment = ",moment().add(1, 'hours').format().split('+'));

    let expiration = moment().add(1, 'hours').format().split('+')[0];
    console.log('expiration ', expiration);
    
    const transactionHeaders = {
      expiration,
      ref_block_num: ref_block_num,
      ref_block_prefix: ref_block_prefix
    }
    // console.log('ref_block = ', info.last_irreversible_block_num)
    // console.log('ref_block 0xFFFF = ', info.last_irreversible_block_num & 0xFFFF);
    // console.log('ref_block_prefix = ', block.ref_block_prefix & 0xFFFF);
    // transactionHeaders = {
    //   expiration,
    //   ref_block_num: info.last_irreversible_block_num & 0xFFFF,
    //   ref_block_prefix: block.ref_block_prefix & 0xFFFF
    // }
    let chainId = env.chainId;
    let keyProvider = [env.privateKey]
    let offlineConfig = {
      httpEndpoint:null,
      chainId:chainId,
      keyProvider:[env.privateKey],
      transactionHeaders
    }
    eos = EOS(offlineConfig);


    try{
      const get_abi = await axios({
        metthod: "POST",
        url: `${env.basePath}/v1/chain/get_abi`,
        data:{
          account_name:'eosio.unregd'
        }
      });
      console.log('get_abi = ', get_abi.data.abi);
      eos.fc.abiCache.abi('eosio.unregd', get_abi.data.abi)
      let transfer = await eos.transaction(
          {
            
            actions: [
              {
                account: 'eosio.unregd',
                name: 'regaccount',
                authorization: [{
                  actor: 'eosio.unregd',
                  permission: 'active'
                }],
                data: {
                  signature:signature,
                  account:name,
                  eos_pubkey:publicKey,
                }
              }
            ]
          }
        );
      transferTransaction = transfer.transaction
      console.log('transferTransaction ', transferTransaction)
      eos = EOS(env.config);

      processedTransaction = await eos.pushTransaction(transferTransaction);
      // console.log('processedTransaction ', processedTransaction)





      // let result = await eos.transaction(
      //   {
      //     headers:headers,
      //     // headers,
      //     actions: [
      //       {
      //         account: 'eosio.unregd',
      //         name: 'regaccount',
      //         authorization: [{
      //           actor: 'eosio.unregd',
      //           permission: 'active'
      //         }],
      //         data: {
      //           signature:signature,
      //           account:name,
      //           eos_pubkey:publicKey,
      //         }
      //       }
      //     ]
      //   }
      // );
      // console.log('result = ', result);
      res.status(200).send('ok')
    }catch(err){
      console.log('err ', err);   
      res.status(code.internal).send(err);   
    }
    

    // eos.contract('eosio.unregd').then(myaccount=>
    //   // console.log("myacc-->",myaccount)
    //   myaccount.regaccount(
    //     signature,
    //     name,
    //     publicKey,
    //     {authorization: 'eosio.unregd'}
    //   )//.then(res1=>console.log("res1--->",res1)).catch(err1=>console.log("err1-->",err1))
    //   // myaccount.add(
    //   //   '0xf9dC54ce1F2BDF3Fa250658ff28902915E3cDE0B',//EthereumId,
    //   //   '100.0000 SYS',//amount
    //   //   {authorization: 'eosio.unregd'}
    //   // ).then(res1=>console.log("res1--->",res1)).catch(err1=>console.log("err1-->",err1))
    // )
    
  } else {
    res.status(code.bad).send({ err: "Incomplete Parameters!" });
  }
};


module.exports = userController;
