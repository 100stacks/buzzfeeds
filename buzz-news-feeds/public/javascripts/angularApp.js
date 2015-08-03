//
// app.js 
//
// 

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
				controller: 'MainCtrl'
			})
			.state('posts', {
				url: '/posts/{id}',					// {id} - is a route parameter that gets passed to PostCtrl 
				templateUrl: '/posts.html',
				controller: 'PostsCtrl'
			});

		$urlRouterProvider.otherwise('home');

	}]);

app.factory('posts', [function() {
	// posts - service body
	// 		- refactoring our $scope.posts variable into service
	//     	- we are using a Factory instead of Service or Provider (http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/)

	var obj = {
		posts: []
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

			if (!$scope.title || $scope.title === '') {  	// do not add an empty title
				return;
			}

			$scope.posts.push({ title: $scope.title,
								link: $scope.link, 
								upvotes:0,
								comments: [
									{ author: 'Joey', body: 'Great post!', upvotes: 0 },
									{ author: 'Bob', body: 'Great idea but its not feasible!', upvotes: 0 }
								]
			});

			$scope.title = ''; 
			$scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
			post.upvotes += 1;
		}

	}]);

app.controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	function($scope, $stateParams, posts) {

		// Posts Controller

		$scope.post = posts.posts[$stateParams.id];			// display the post based on its 'id'
		console.log('PostsCtrl - post:', $scope.post);

		// Allow users to add comments to posts

		$scope.addComment = function() {
			console.log('PostsCtrl - addComment()');
			console.log('comment - ', $scope.body);

			if ($scope.body === '') {						// blank comment, don't add to post comments section
				return;
			}

			$scope.post.comments.push({
				body: $scope.body,
				author: 'user',
				upvotes: 0
			});

			$scope.body = '';
		};

		$scope.incrementUpvotes = function(comment) {
			console.log('incrementUpvotes in PostsCtrl', comment)
			post.comments[comment].upvotes++ ;
		}

	}]);





















