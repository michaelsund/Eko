var moment = require('moment');
var express = require('express');
var router = express.Router();

// ----------------------------------------------------------
// Models
// ----------------------------------------------------------
var Salary = require('../models/salary-model').Salary
var Cost = require('../models/cost-model').Cost
var async = require('async');

router.route('/salary'
).get(function (req, res) {
  Salary.find({}, function(err, docs) {
    if (err) {
      res.status(400).send();
    }
    else {
      res.status(200).send(docs);  
    }
  });
}
).put(function(req, res) {
    var s = new Salary({
      'year': req.body.year,
      'month': req.body.month,
      'date': req.body.date,
      'category': req.body.category,
      'value': req.body.value,
      'by': req.body.by,
    });      
    s.save(function(err) {
      if (err) {
        console.log(err);
        res.status(400).send({
          'success': false,
          'message': 'Kunde inte lägga till inkomst.'
        });
      }
      else {
        res.status(200).send({
          'success': true,
          'message': 'Inkomst tillagd.'
        });  
      }
    });
});

router.route('/cost'
).get(function (req, res) {
  Cost.find({}, function(err, docs) {
    if (err) {
      res.status(400).send();
    }
    else {
      res.status(200).send(docs);  
    }
  });
}
).put(function(req, res) {
    console.log('new cost!');
    console.log(req.body);
    var c = new Cost({
      'year': req.body.year,
      'month': req.body.month,
      'date': req.body.date,
      'category': req.body.category,
      'amount': req.body.amount,
      'by': req.body.by,
    });      
    c.save(function(err) {
      if (err) {
        console.log(err);
        res.status(400).send({
          'success': false,
          'message': 'Kunde inte lägga till kostnad.'
        });
      }
      else {
        res.status(200).send({
          'success': true,
          'message': 'Kostnad tillagd.'
        });  
      }
    });
});

module.exports = router