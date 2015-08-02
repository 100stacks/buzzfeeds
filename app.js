//
// app.js 
//

var app = angular.module('buzzFeeder', []);

app.controller('MainCtrl', [
	'$scope',
	function ($scope) {
		$scope.test = "Hello from Buzz Feeder!";

		$scope.posts = [
			{ title: 'Post 1', upvotes: 5 },
			{ title: 'Post 2', upvotes: 2 },
			{ title: 'Post 3', upvotes: 15 },
			{ title: 'Post 4', upvotes: 9 },
			{ title: 'Post 5', upvotes: 4 }
		];

		$scope.addPost = function() {

			if (!$scope.title || $scope.title === '') {  	// do not add an empty title
				return;
			}

			$scope.posts.push({ title: $scope.title, upvotes: 0 });
			$scope.title = '';
		};

		$scope.incrementUpvotes = function(post) {
			post.upvotes += 1;
		}

	}]);