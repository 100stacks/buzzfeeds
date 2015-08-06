/*
	User Model - with authentication
*/

var mongoose = require('mongoose');
var crypto = require('crypto');									// Node's native *crypto* module to hash passwords
var jwt = require('jsonwebtoken');								// RFC 7519 - https://tools.ietf.org/html/rfc7519


var UserSchema = new mongoose.Schema({
	username: { type: String, lowercase: true, unique: true },
	hash: String,
	salt: String
});

/* crypto.pbkdf2Sync() method takes four parameters:
	- password
	- salt
	- iterations
	- key length

	setPassword() and validPassword() methods need to have matching iterations and key length to 
	generate IDENTICAL hash, otherwise this will generate validation errors
*/
UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');								// Store this for later to verify password hash

	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

	return this.hash === hash;
};

/* jwt.sign() method takes two arguments
	- 1st argument is that payload that gets signed.  Both client and server have access to the payload
	- 2nd argument is used to sign our tokens.  IT IS STRONGLY RECOMMENDED TO USE AN ENVIRONMENT VARIABLE!
*/

UserSchema.methods.generateJWT = function() {

	// set expiration to 60 days
	var today = new Date();
	var expire = new Date(today);

	expire.setDate(today.getDate() + 60);

	return jwt.sign({
		_id: this._id,
		username: this.username,
		expire: parseInt(expire.getTime() / 1000)
	}, 'PUTB3ANS0NIT');															// NOTE: Move to an environment variable
}


mongoose.model('User', UserSchema);