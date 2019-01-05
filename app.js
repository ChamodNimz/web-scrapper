// https://nibm-api.herokuapp.com/results/cohdse181f-008 - get  REST data link

const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/config');

// Passing passport instance to passport.js to Extract JWT and validate login 
require('./config/passport')(passport);
// Connect to mongoDB
mongoose.connect(config.database,{useNewUrlParser:true})
    .then(function(){
        console.log('mongoDB connected');
    })
    .catch(function(){
        console.log('Error :');
	}) 
	
const port = process.env.PORT || 3000;

var main = require('./routes/api/main');
var profile = require('./routes/api/profile');
var modules = require('./routes/api/modules');
const app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
	res.send({ message: 'API works ...' });
});

app.use('/web/api',main); // api main
app.use('/web/api',profile); // api profile
app.use('/web/api',modules); // api modules

app.listen(port, () => console.log(`app listening on port ${port}!`));

process.on('uncaughtException', function (error) {
	console.log(error);
});