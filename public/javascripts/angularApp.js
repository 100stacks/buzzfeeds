/*
 	AngularApp.js

	The logic for the Angular Application (app.js)
*/

var app = angular.module('buzzNewsFeeder', ['ui.router']);	// adding an external module as a dependency in our app
															// NOTE: We are using 'ui-router' instead of Angular's built-in 'ngRoute'
															// 	as it is newer and provides more flexibility and features.


app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		
		// app config block used to configure a *home* state using $stateProvider and $urlRouterProvider,
		// 	use otherwise() to redirect unspecified routes

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve: {
					postPromise: ['posts', function(posts) {
						return posts.getAll();
					}]
				}
			});

		$stateProvider	
			.state('posts', {
				url: '/posts/{id}',					// {id} - is a route parameter that gets passed to PostCtrl (the MondoDB _id)
				templateUrl: '/posts.html',
				controller: 'PostsCtrl',
				resolve: {
					post: ['$stateParams', 'posts', function($stateParams, posts) {
						return posts.get($stateParams.id);
					}]
				}
			});

		$urlRouterProvider.otherwise('home');

	}]);

/* Post Service */
app.factory('posts', ['$http', function($http) {
	// 		- refactoring our $scope.posts variable into service
	//     	- we are using a Factory instead of Service or Provider (http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/)

	var obj = {
		posts: []
	};

	obj.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, obj.posts);							// angular.copy() creates a DEEP copy of the returned data
		});															// 	Ensures $scope.posts is updated in MainCtrl so all new data
	};																//	will also be updated in the view 

	obj.get = function(id) {
		return $http.get('/posts/' + id).then(function(response) {
			return response.data;
		});
	};

	obj.create = function(post) {
		return $http.post('/posts', post).success(function(data) {	// success() function allows us to bind a function that will
			obj.posts.push(data);									// 	be executed when the request returns
		});  
	};

	obj.upvote = function(post) {
		return $http.put('/posts/' + post._id + '/upvote').success(function(data) {
			post.upvotes += 1;
		});
	};

	obj.addComment = function(id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	};

	obj.upvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
						.success(function(data) {
							comment.upvotes += 1;
		});
	};

	return obj;

}]);

app.controller('MainCtrl', [
	'$scope',
	'posts',							// inject the 'posts' service into our controller so we can access its data
	function ($scope, posts) {

		$scope.posts = posts.posts;		// now any change or modification made to $scope.posts will be stored in the service,
										// the 'posts' factory (posts.posts), and with two-way binding data-binding this
										// makes it immediately accessible by any other module that injects the posts service. 

		// $scope.posts = [
		// 	{ title: 'Post 1', upvotes: 5 },
		// 	{ title: 'Post 2', upvotes: 2 },
		// 	{ title: 'Post 3', upvotes: 15 },
		// 	{ title: 'Post 4', upvotes: 9 },
		// 	{ title: 'Post 5', upvotes: 4 }
		// ];

		$scope.addPost = function() {

			if (!$scope.title || $scope.title === '') {  	// do not add an empty Post
				return;
			}

			posts.create({
				title: $scope.title,
				link: $scope.link
			});

			// $scope.posts.push({ title: $scope.title,
			// 					link: $scope.link, 
			// 					upvotes:0,
			// 					comments: [
			// 						{ author: 'Joey', body: 'Great post!', upvotes: 0 },
			// 						{ author: 'Bob', body: 'Great idea but its not feasible!', upvotes: 0 }
			// 					]
			// });

			$scope.title = ''; 
			$scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
			posts.upvote(post);

			// posts.upvotes += 1;
		};

	}]);

app.controller('PostsCtrl', [
	'$scope',
	'posts',
	'post',
	function($scope, posts, post) {

		// Posts Controller

		$scope.post = post;									
		console.log('PostsCtrl - post:', $scope.post);

		// Allow users to add comments to posts

		$scope.addComment = function() {
			console.log('PostsCtrl - addComment()');
			console.log('comment - ', $scope.body);

			if ($scope.body === '') {						// blank comment, don't add to post comments section
				return;
			}

			posts.addComment(post._id, {
				body: $scope.body,
				author: 'user',
			}).success(function(comment) {
				$scope.post.comments.push(comment);
			});

			$scope.body = '';
	
		};

		$scope.incrementCommentUpvotes = function(comment) {
			console.log('**upvoteComment - incrementUpvotes for ', comment);
			posts.upvoteComment(post, comment);
		};

	}]);


