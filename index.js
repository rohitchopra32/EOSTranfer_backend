var express =  require('express');
var moment = require('moment');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config');
var app = express();
var port = 8085;
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res)=>{
    res.send("Welcome to EOS Project!");
});
if(app.get('env')==='local' || app.get('env')==='development'){
    console.log('EOS running on ', app.get('env'));
    mongoose.connect(config.db.uri,{ useNewUrlParser: true });
}
else if(app.get('env')==='production'){
    console.log('EOS running on ', app.get('env'));
    mongoose.connect(config.prodDb.uri,{ useNewUrlParser: true });
}

/**
 * call main router file 
 */
const rootRouter = require('./src/rootRouter.js')(app);
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
console.log('time : ', moment().format('LLLL'));