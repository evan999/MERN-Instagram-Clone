const mongoose = require('mongoose');

const instance = mongoose.Schema({
	caption: String,
	user: String,
	image: String,
	comments: [],
});

module.exports = Posts = mongoose.model('posts', instance);
