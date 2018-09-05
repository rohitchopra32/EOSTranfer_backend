const user = require('./components/user/router');
const payment = require('./components/payment/router');

module.exports = (app) =>{
    app.use('/user', user);
    app.use('/payment', payment);
}