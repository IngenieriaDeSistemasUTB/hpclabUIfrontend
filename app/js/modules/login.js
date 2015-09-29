'use strict';

(function () {
   var login = angular.module('loginmodule', []);

   login.controller('loginController', function ($scope, jwt_loginService,$location) {
      $scope.login = function (user) {
         jwt_loginService.login(user).then(function (result) {
            var token = JSON.stringify(result.data.token);
            if (!window.localStorage.getItem("token")) {

               window.localStorage.setItem("token", token);
            }
            $location.path('/home');

         });
      }
   });

   login.factory('jwt_loginService', function ($http) {
      var loginSvc = {};
      loginSvc.login = function (user) {
         return $http({
            method: "POST",
            url: "https://api.hpclab.unitecnologica.edu.co/api-token-auth/",
            data: user
         });
      }
      return loginSvc;
   });

   login.factory('loginService', function ($http, $location) {
      return {
         login: function (user) {
            var $promise = $http.post("https://api.hpclab.unitecnologica.edu.co/api-token-auth/", user);
            $promise.then(function (response) {
               $location.path('/home');
               $location.replace();
            }, function (response) {
               user.error = true;
            });
         }
      }
   });
})();
