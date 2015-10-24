var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	year: {type: Number},
	month: {type: String},
	date: {type: Date},
	category: {type: String},
	desc: {type: String},
	amount: {type: Number},
	by: {type: String}
});
var Cost = mongoose.model('Cost', schema);

exports.Cost = Cost;