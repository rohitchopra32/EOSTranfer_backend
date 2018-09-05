/**
 * Payment Controller
 */

const utility = require("../../utils/utility");
const env = require("../../utils/env");
const code = require("../../utils/statusCode");
const userModel = require("../user/model");
const paymentModel = require("./model");

var paymentController = {};

paymentController.getPaymentFromCoin = (req, res) => {
  console.log("req in  getPaymentFromCoin ", req.body);
  let status = parseInt(req.body.status);
  if (status < 0) {
    console.log("Failures/Errors");
    res.status(200).send({ data: "ok" });
  } else if (status >= 0 && status <= 99) {
    console.log("Payment is Pending in some way");
    res.status(200).send({ data: "ok" });
    
  } else {
    console.log("Payment completed successfully");
    
    paymentModel.findOneAndUpdate(
        { userName: req.body.buyer_name },
        { $set: { status: "complete" } },
        (err, payData) => {
          if (err) {
            console.log("err in paymentModel");
            res.status(200).send({ data: "ok" });
          } else if (payData) {
            userModel.findOne({ name: req.body.buyer_name }, (err, data) => {
              if (err) {
                console.log("err in userModel");
                res.status(200).send({ data: "ok" });
              } else if (data) {
                let _data = {
                  account_name: data.name,
                  publicKey: data.ownerKey
                };
                utility.newAccount(_data, (err, result) => {
                  if (err) {
                    console.log("err in new Account", err);
                    res.status(200).send({ data: "ok" });
                  } else {
                    console.log("Account created Successfully!");
                    res.status(200).send({ data: "ok" });
                  }
                });
              } else {
                res.status(200).send({ data: "ok" });
              }
            });
          } else {
            res.status(200).send({ data: "ok" });
          }
        }
      );
  }
};

module.exports = paymentController;
