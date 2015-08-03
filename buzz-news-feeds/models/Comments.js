//
// Comments Model
//
// In Mongoose, we can create relationships between different data models using the ObjectId type.
// The ObjectId data type refers to a 12 byte MongoDB ObjectId - http://api.mongodb.org/java/current/org/bson/types/ObjectId.html
//	which is actually stored in the database.  It is not a random number, uses time stamp, computer pid, incremental digits



	var mongoose = require('mongoose');								// require global mongoose object

	var CommentSchema = new mongoose.Schema({
		body: String,
		author: String,
		upvotes: { type: Number, default: 0 },
		post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post'}	// The 'ref' property tells Mongoose what type of object
	});																// 	the ID references and enables us to retrieve both
																	// 	items simultaneously

	mongoose.model('Comment', CommentSchema);