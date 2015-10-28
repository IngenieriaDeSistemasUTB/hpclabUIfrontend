'use strict';

(function () {
	var app = angular.module('app', [
		'ui.router',
		'angular-jwt',
		'oc.lazyLoad',
		'ngMessages',
		'factories',
		'loginmodule',
		'homemodule',
		'projectmodule',
		'filemodule',
		'ui.materialize',
		'ngAnimate',
		'ngResource'
	]);

	var config = function ($stateProvider, $urlRouterProvider, $locationProvider, $ocLazyLoadProvider, $httpProvider) {

		$httpProvider.interceptors.push(function ($location, $q, jwtHelper) {
			return {
				request : function (conf) {
					var token = localStorage.getItem('token');
					if (token && !jwtHelper.isTokenExpired(token)) {
						conf.headers.Authorization = 'Bearer ' + token;
					} else {
						localStorage.removeItem('token');
						$location.path("/login");
					}
					return conf;
				}
			}
		});

		$stateProvider
			.state('login', {
				cache: false,
				url         : '/login',
				templateUrl : '/views/login.html',
				controller  : 'loginController',
				resolve: {
					verifyToken: function($location, jwtHelper){
						var token = localStorage.getItem('token');
						if (token && !jwtHelper.isTokenExpired(token)) {
							$location.path("/home");
						}
					}
				}
			})
			.state('home', {
				url         : '/',
				templateUrl : '/views/home.html',
				controller  : 'HomeController'
			})
			.state('admin', {
				url: '/admin',
				templateUrl: 'views/admin.html',
				controller: 'InicioController'
			})
			.state('home.project',{
				url: 'project/:projectID',
				templateUrl: '/views/projectDetail.html',
				controller: 'ProjectController',
				onEnter: function($state, $stateParams){
					if(!$stateParams.projectID){
						$state.transitionTo('/')
					}
				}
			})
                        .state('home.files',{
                                url: 'files',
                                templateUrl: '/views/files.html',
				controller: 'FileController'
                        });


		$urlRouterProvider.otherwise("/login");

		if (window.history && window.history.pushState) {
			$locationProvider.html5Mode({
				enabled     : true,
				requireBase : false
			});
		}
	};

	app.config(config);
})();
