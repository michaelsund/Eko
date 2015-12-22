var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: {type: String},
});
var Category = mongoose.model('Category', schema);

exports.Category = Category;
