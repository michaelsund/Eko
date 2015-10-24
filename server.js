var mongoose = require('mongoose');

// ----------------------------------------------------------
// Connect to db
// ----------------------------------------------------------
mongoose.connect('mongodb://127.0.0.1/eko', function(error) {
  if (error)
    console.log('mongo connection error: ' + error);
  else
    console.log('MongoDb connected');
})

var morgan = require('morgan');
var express = require('express');
var app = express()
var bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(morgan('dev'));
app.engine('html', require('ejs').renderFile);
var viewroutes = require('./routes/viewroutes');
var apiroutes = require('./routes/apiroutes');
app.use('/', viewroutes);
app.use('/api', apiroutes);
app.use(express.static('public'));


// app.use (err, req, res, next) ->
// 	res.status(400).send('Boom goes the dynamite')
// 	logging.ExpressBodyparser req, err

// ----------------------------------------------------------
// Server start
// ----------------------------------------------------------
var server = app.listen(4000);
console.log('listening on port: 4000');
