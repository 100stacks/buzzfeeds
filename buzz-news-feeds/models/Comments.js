//
// Comments Model
//

	var mongoose = require('mongoose');			// require global mongoose object

	var CommentSchema = new mongoose.Schema({
		body: String,
		author: String,
		upvotes: { type: Number, default: 0 },
		post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
	});

	mongoose.model('Comment', CommentSchema);