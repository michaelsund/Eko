var mongoose = require('mongoose');

var schema = new mongoose.Schema({ 
	year: {type: Number},
	month: {type: String},
	date: {type: Date},
	category: {type: String},
	value: {type: Number},
	by: {type: String}		
});
var Salary = mongoose.model('Salary', schema);

exports.Salary = Salary;