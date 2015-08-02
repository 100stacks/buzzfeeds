//
// app.js 
//

var app = angular.module('buzzFeeder', []);

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
		$scope.test = "Hello from Buzz Feeder!";

		$scope.posts = posts.posts;		// now any change or modification made to $scope.posts will be stored in the service,
										// and immediately accessible by any other module that injects the posts service. 

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
								upvotes:0 });

			$scope.title = ''; 
			$scope.link = '';
		};

		$scope.incrementUpvotes = function(post) {
			post.upvotes += 1;
		}

	}]);