var express = require('express');
var mongoose = require('mongoose');
var router = express.Router()
var path = require('path');
var request = require('request');


// ----------------------------------------------------------
//
// View Routes
//
// ----------------------------------------------------------
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../index.html'));
})

module.exports = router