//
// Express Routes
//
// Routes allow our application frontend to communicate with our backend logic and MondoDB  

/*		We consider the actions a user can perform:
			- view all posts
			- Add a new post
			- Upvote (+1) a post
			- View comments associated with a post
			- Add a comment
			- Upvote (+1) a comment
*/

/*		REST Routes and Associated Actions

-----------------------------------------------------------------------------------------
| REST Route 						| Action	
-----------------------------------------------------------------------------------------
| GET/posts							| Return a list of posts and associated metadata
| POST/posts						| Create a NEW post
| GET/posts/:id 					| Return an individual post with associated comments
| PUT/posts/:id/upvote				| Upvote (+1) a post, using the Post ID
| POST/posts/:id/comments			| Add a NEW comment to a post by ID
| PUT/posts/:id/comments/:id/upvote | Upvote (+1) a comment	
-----------------------------------------------------------------------------------------
*/


var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');				// import *mongoose* object (our db)
var Post = mongoose.model('Post');				// instantiate a handle to Post model
var Comment = mongoose.model('Comment');		// instantiate a handle to Comment model

/* Preload objects - We can use Express's param() function to automatically load an object, rather
	than duplicating the same code across several different request handler functions. 

	- we define a route URL with :post 
	- assuming our :post parameter contains an ID, our callback function will retrieve the post object
		from the database, and attach it to the to request object
	- then, the router handler function will be called

*/ 

router.param('post', function(request, response, next, id) {
	var query = Post.findById(id);

	query.exec(function(err, post) {
		if (err) {
			return next(err);
		}

		if (!post) {
			return next(new Error('Post not found'));
		}

		request.post = post;
		return next();
	});

});

/* Comment middleware function to automatically retrieve comments by the :comment route parameter */
router.param('comment', function(request, response, next, id) {
	var query = Comment.findById(id);

	query.exec(function(err, post) {
		if (err) {
			return next(err);
		}

		if (!post) {
			return next(new Error('Comment not found'));
		}

		request.post = post;
		return next();
	});

});

/* GET home page. */
router.get('/', function(request, response, next) {
  res.render('index', { title: 'Buzz News Feeder' });
});

/* GET all posts in a JSON list */
router.get('/posts', function(request, response, next) {		// Express get() method defines URL route on which to execute

	console.log('** Express get() /posts route **');

	Post.find(function(err, posts) {							// Mongoose find() to query MongoDB for ALL posts
		if (err) {
			return next(err);
		}

		response.json(posts);									// Return ALL posts in a JSON list
	});
});

/* Create a NEW Post */
router.post('/posts', function(request, response, next) {

	console.log('** Express post() /posts route **');

	var post = new Post(request.body);

	post.save(function(err, post) {								// Mongoose save() to save new post to MongoDB
		if (err) {
			return next(err);
		}

		response.json(post);
	});
});

/* Return a SINGLE Post with any associated Comments */
router.get('/posts/:post', function(request, response, next) {
	request.post.populate('comments', function(err,post) {			// Use the populate() function to retrieve comments 

		if (err) {
			return next(err);
		}
	});

	response.json(post);
})

/* Upvote a Post */
router.put('/posts/:post/upvote', function(request, response, next) {
	request.post.upvote(function(err, post) {
		if (err) {
			return next(err);
		}

		response.json(post);
	});
});

/* Create a Comment for a Post */
router.post('/posts/:post/comments', function(request, response, next) {
	var comment = new Comment(request.body);
	comment.post = request.post;

	comment.save(function(err, comment) {
		if (err) {
			return next(err);
		}

		request.post.comments.push(comment);
		request.post.save(function(err, post) {
			if (err) {
				return next(err);
			}

			response.json(comment);
		});
	});

 });

/* Upvote a Comment for a Post */
router.put('/posts/:post/comments/:comment/upvote', function(request, response, next) {
	request.post.upvote(function(err, post) {
		if (err) {
			return next(err);
		}

		response.json(post);
	});
});

module.exports = router;


