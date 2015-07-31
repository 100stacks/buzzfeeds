//
// app.js 
//

var app = angular.module('buzzFeeder', []);

app.controller('MainCtrl', [
	'$scope',
	function ($scope) {
		$scope.test = "Hello from Buzz Feeder!";
	}]);