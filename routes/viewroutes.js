var express = require('express');
var mongoose = require('mongoose');
var router = express.Router()
var path = require('path');
var request = require('request');
var jwt = require('jsonwebtoken');
var config = require('../config.json');


// ----------------------------------------------------------
//
// View Routes
//
// ----------------------------------------------------------
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/partials/login.html'));
});

router.get('/main', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/partials/index.html'));
});

router.post('/authenticate', function(req, res) {
  console.log('password: ' + req.body.password);
  if (req.body.password) {
    console.log('password was given!')
    if (req.body.password != config.tokensecret) {
      console.log('wrong password')
      res.json({ success: false, message: 'Wrong password' });
    }
    else {
      console.log('correct password given!')
      var token = jwt.sign({ 'data': Math.random() * (100000 - 1) + 1 }, config.tokensecret, {
        // expiresIn: 43200
        expiresInDays: 30
      });
      res.json({ success: true, message: 'Heres your token', token: token });
    }
  }
  else {
    res.json({ success: false, message: 'No password given..' });
  }
});

router.post('/verifytoken', function(req, res) {
  console.log('token: ' + req.body.token);
  if (req.body.token) {
    console.log('token was given!')
    jwt.verify(req.body.token, config.tokensecret, function(err, decoded) {
      if (err) { 
        res.status(200).send({ 
          success: false, 
          message: 'Token error, YOU SHALL NOT PASS!' 
        });
      }
      else {
        res.status(200).send({ 
          success: true, 
          message: 'Token is valid' 
        });
      }
    });
  }
  else {
    res.status(200).send({
      'success': false,
      'message': 'No token provided!'
    })  
  }
});


module.exports = router