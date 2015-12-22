var moment = require('moment');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config.json');


// Token middleware
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.tokensecret, function(err, decoded) {
      if (err) {
        res.status(200).send({
          success: false,
          message: 'Error using token'
        });
      }
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    return res.status(200).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

// ----------------------------------------------------------
// Models
// ----------------------------------------------------------
var Salary = require('../models/salary-model').Salary
var Cost = require('../models/cost-model').Cost
var Category = require('../models/category-model').Category
var async = require('async');


// Routes
router.route('/salary'
).get(function (req, res) {
  Salary.find({}, function(err, docs) {
    if (err) {
      res.status(400).send();
    }
    else {
      res.status(200).send(docs);
    }
  }).sort({'date':1});
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

router.delete('/salary/:_id?', function(req, res){
  Salary.findByIdAndRemove(req.params._id, function(err, doc) {
    if (err || !doc) {
      res.status(400).send({
        'success': false
      });
    }
    else {
      res.status(200).send({
        'success': true
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
  }).sort({'date':1});
}
).put(function(req, res) {
    var c = new Cost({
      'year': req.body.year,
      'month': req.body.month,
      'date': req.body.date,
      'category': req.body.category,
      'desc': req.body.desc,
      'amount': req.body.amount,
      'by': req.body.by,
    });
    c.save(function(err) {
      if (err) {
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

router.delete('/cost/:_id?', function(req, res){
  Cost.findByIdAndRemove(req.params._id, function(err, doc) {
    if (err || !doc) {
      res.status(400).send({
        'success': false
      });
    }
    else {
      res.status(200).send({
        'success': true
      });
    }
  });
});

router.route('/category'
).get(function (req, res) {
  Category.find({},{_id:0,__v:0}, function(err, docs) {
    if (err) {
      res.status(400).send();
    }
    else {
      res.status(200).send(docs);
    }
  });
}

).put(function(req, res) {
    var c = new Category(req.body);
    c.save(function(err) {
      if (err) {
        res.status(400).send({
          'success': false,
          'message': 'Kunde inte lägga till kategori.'
        });
      }
      else {
        res.status(200).send({
          'success': true,
          'message': 'Kategori tillagd.'
        });
      }
    });
});

router.route('/delcategory'
).put(function(req, res) {
  Category.remove({'name': req.body.name}, function(err, doc) {
    if (err || !doc) {
      res.status(400).send({
        'success': false
      });
    }
    else {
      res.status(200).send({
        'success': true
      });
    }
  });
});

router.post('/monthschart', function(req, res) {
  var tmpSalary = {};
  var tmpCosts = {};
  async.parallel([
    function(callback) {
      Cost.find({'year':req.body.year,'month':{$in:req.body.months}}, function(err, docs) {
        for (x in docs) {
          if (tmpCosts[docs[x].month]) {
            tmpCosts[docs[x].month] += docs[x].amount;
          }
          else {
            tmpCosts[docs[x].month] = docs[x].amount;
          }
        }
        callback(null, tmpCosts);
      }).sort({'date':1});
    },
    function(callback) {
      Salary.find({'year':req.body.year,'month':{$in:req.body.months}}, function(err, docs) {
        for (x in docs) {
            if (tmpSalary[docs[x].month]) {
              tmpSalary[docs[x].month] += docs[x].value;
            }
            else {
              tmpSalary[docs[x].month] = docs[x].value;
            }
        }
        callback(null, tmpSalary);
      }).sort({'date':1});;
    }
  ],
  function(err, results){
    var cmp = compareKeys(results[0], results[1]);
    if (cmp) {
      res.status(200).send(results);
    }
    else {
      var result = [];
      var result = findZeros(results[0], results[1]);
      res.status(200).send(result);
    }
  });
});

function findZeros(costs, salarys) {
  // compare the cost and salary array, find out if there are mismatchs and set add missing and set to 0
  for (key in costs) {
    if (!salarys.hasOwnProperty(key)) {
      salarys[key] = 0;
    }
  }
  // same for the costs array, we need to have data in the graph, even if none was found in the query for that month
  for (key in salarys) {
    if (!costs.hasOwnProperty(key)) {
      costs[key] = 0;
    }
  }
  var toreturn = [costs,salarys];
  return(toreturn);
}

function compareKeys(a, b) {
  var aKeys = Object.keys(a).sort();
  var bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

module.exports = router
