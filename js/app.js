(function() {
    //Create a module
    
	let app = angular.module('app', ['ui.router', 'istAuth']);
	const token = 'DAPX9Jq9Z1lrSbuIgkwUAFJGdHaLWyDMP2OrgUPf';
	let counter = 1;
    

	//Config Block
	app.config(function($stateProvider, $urlRouterProvider) {
		//Configure the routes for the application
		$stateProvider.state('index', {
			url: '/index',
			templateUrl: '/templates/index.html',
			controller: 'indexCtrl'
		}).state('feed', {
			url: '/feed',
			templateUrl: '/templates/feed.html',
			controller: 'feedCtrl'
		}).state('feedItem', {
			url: '/feed/:id',
			templateUrl: '/templates/feed-item.html',
			controller: 'feedItemCtrl'
		}).state('upload', {
			url: '/upload',
			templateUrl: '/templates/upload.html',
			controller: 'uploadCtrl'
		}).state('profile', {
			url: '/profile/:id',
			templateUrl: '/templates/profile.html',
			controller: 'profileCtrl',
			params: {id:null}
		})
		//If the user requests a URL that isn't mapped to a route, redirect them to the homepage
		$urlRouterProvider.otherwise('index');
    });
    


	//Run Block
	app.run(function($rootScope, $auth, $state) {
		//Globally available functions to toggle Bootstrap modals
		$rootScope.openModal = function(selector) {
			$(selector).modal('show');
		};
		$rootScope.closeModal = function(selector) {
			$(selector).modal('hide');
		};
		//Check to see if the user is already logged in. If not, redirect to the homepage
		var isLoggedIn = $auth.checkAuth();
		if (!isLoggedIn) {
			$state.go('index');
		}
		//If user is already logged in, set the $rootScope.user and $rootScope.token objects
		$auth.loginFromSaved();
    });
    



	//Controllers
	app.controller('indexCtrl', function() {
		//Controller logic here
    });
    

app.controller('mainCtrl', function($scope, $auth, $rootScope) {
				$scope.username = '';
				$scope.password = '';
				$scope.log_in = function() {
					$auth.login($scope.username, $scope.password, function() {
						console.log('login :)')
						$rootScope.closeModal('#modal_login');
					});
				}
				$scope.log_out = function() {
					$auth.logout();
				}

});
		
			// END MAIN //////////////////////////////////////////////////////////
    

app.controller('feedCtrl', function($scope, $http) {
					$scope.pictures = [];
					$scope.meta = {};
							
					$http({
						url: 'https://exchangeagram.azurewebsites.net/api/media',
						method: 'GET',
						params: {
							token: token,
							count: 12
						}
					}).then(function(response) {
						console.log(response);
						$scope.pictures = response.data.data;
						$scope.meta = response.data.meta;
					}, function(error) {
						console.log(error);
					});
						
					
					$scope.loadMore = function() {
						counter = counter + 1;
						console.log(counter);

						$http({
							url: 'https://exchangeagram.azurewebsites.net/api/media',
							method: 'GET',
							params: {
								token: token,
								count: 12,
								page: counter
							}
						}).then(function(response) {
							console.log(response);
							$scope.meta = response.data.meta;
							response.data.data.forEach(function(item){
									$scope.pictures.push(item);
							});
					
						}, function(error) {
							console.log(error);
						});
						
						
					};

		
});
		
    	// END FEED//////////////////////////////////////////////////////////

app.controller('feedItemCtrl', function($http, $stateParams, $scope, $window, $state, $rootScope) {
				$scope.feedItem = [];
				$scope.caption = '';
				$scope.comments = [];
				
				$http({
					url: 'https://exchangeagram.azurewebsites.net/api/media',
					method: 'GET',
					params: {
						token: token,
						id: $stateParams.id
					}
				}).then(function(response) {
					console.log(response);
					$scope.feedItem = response.data.data;
					
				}, function(error) {
					console.log(error);
				});

				// $http({
				// 	url: 'https://exchangeagram.azurewebsites.net/api/media',
				// 	method: 'GET',
				// 	params: {
				// 		token: token,
				// 		id: $stateParams.id
				// 	}
				// }).then(function(response) {
				// 	console.log(response);
				// 	console.log('success');
				// 	$scope.comments = response.data.data.item.comments;
					
				// }, function(error) {
				// 	console.log(error);
				// });

				$scope.edit_post = function() {
					$http({
						url: 'https://exchangeagram.azurewebsites.net/api/media/update',
						method: 'POST',
						params: {
							token: token,
							id: $stateParams.id,
							caption: $scope.caption
						}
					}).then(function(response) {
						console.log(response);
						console.log('success');
						$rootScope.closeModal('#modal_post');
						$window.location.reload();

					}, function(error) {
						console.log(error);
			
					});

				};

				$scope.delete_post = function() {
					$http({
						url: 'https://exchangeagram.azurewebsites.net/api/media/delete',
						method: 'POST',
						params: {
							token: token,
							id: $stateParams.id
						}
					}).then(function(response) {
						console.log(response);
						console.log('success');
						$rootScope.closeModal('#modal_post');
						setTimeout(function(){
							$state.go('profile', {
								id:$rootScope.auth.id
							});
						},0);
						

					}, function(error) {
						console.log(error);
			
					});

				};

				$scope.like_post = function() {
					$http({
						url: 'https://exchangeagram.azurewebsites.net/api/like',
						method: 'POST',
						params: {
							token: token,
							id: $stateParams.id
						}
					}).then(function(response) {
						console.log(response);
						console.log('success');
						$window.location.reload();

					}, function(error) {
						console.log(error);
			
					});

				};

				$scope.unlike_post = function() {
					$http({
						url: 'https://exchangeagram.azurewebsites.net/api/like/delete',
						method: 'POST',
						params: {
							token: token,
							id: $stateParams.id
						}
					}).then(function(response) {
						console.log(response);
						console.log('success');
						$window.location.reload();

					}, function(error) {
						console.log(error);
			
					});

				};

				$scope.comment_post = function() {
					var addComment = $http({
						url: 'https://exchangeagram.azurewebsites.net/api/comment',
						method: 'POST',
						params: {
							token: token,
							media_id: $stateParams.id,
							comment: $scope.comment
						}
					}).then(function(response) {
							console.log(response);
							$window.location.reload();

					}, function(error) {
						console.log(error);
			
					});
					
					$scope.comments.comment_post(addComment);
				}; 

});
		
		
		// END FEED ITEM//////////////////////////////////////////////////////////

app.controller('uploadCtrl', function($window, $state) {
			let url = $window.location.href;
			if (url.includes('success=') && url.includes('id=')) {
				let url_success = url.split('success=')[1].split('&')[0]
				let url_id = url.split('id=')[1].split('&')[0];
				$state.go('feedItem', {
					id: url_id
				});
			};

});
		

		// END UPLOAD //////////////////////////////////////////////////////////
    

app.controller('profileCtrl', function($scope, $http, $stateParams, $rootScope, $window) {
				$scope.profile = [];
				$scope.posts = [];

				$scope.username = '';
				$scope.bio = '';

				$http({
					url: 'https://exchangeagram.azurewebsites.net/api/user',
					method: 'GET',
					params: {
						token: token,
						id: $stateParams.id
					}
				}).then(function(response) {
					console.log(response);
					$scope.profile = response.data.data;
					$scope.posts = response.data.data.media;

				}, function(error) {
					console.log(error);

				});

				// END HTTP REQUEST
				$scope.edit_profile = function() {
					$http({
						url: 'https://exchangeagram.azurewebsites.net/api/user/update',
						method: 'POST',
						params: {
							token: token,
							username: $scope.username,
							bio: $scope.bio
						}
					}).then(function(response) {
						console.log(response);
						console.log('success')
						$rootScope.closeModal('#modal_profile');
						$window.location.reload();

					}, function(error) {
						console.log(error);
			
					});

				};

});
		// END PROFILE //////////////////////////////////////////////////////////
    




	//Components
	app.component('mainHeader', {
		templateUrl: '/templates/main-header.html',
		controller: 'mainCtrl'
	});
	app.component('footer', {
		templateUrl: '/templates/footer.html',
	});
})();