'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('pooIhmExemplesApp')
  .controller('UsersCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.getAllUsers = function(){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users')
        .success(function(data) {
          $scope.users = data.data;
        })
        .error(function(data){
          document.getElementById("error").innerHTML = "erreur";
        })
    }

   $scope.getAllUsers();

    $scope.getCurrentUser = function(id){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId)
        .success(function(data) {
          $scope.currentUser = data.data;
          $scope.getRoles($routeParams.userId);
          $scope.projectTitles = [];
          $scope.projectYears = [];
          $scope.getProjects($routeParams.userId);
        }
      )
    }

    if($routeParams.userId) {
      $scope.getCurrentUser();
    }


    $scope.createUser = function(name,surname,email,website){
      var user = {};
      user.name = name;
      user.surname = surname;
      user.email = email;
      user.website = website;
      $http.post("http://poo-ihm-2015-rest.herokuapp.com/api/Users/",user)
        .success(function(data) {
          $scope.getAllUsers();
        })

    }

    $scope.updateUser = function(id,name,surname,email,website){
      var user = {};
      user.name = name;
      user.surname = surname;
      user.email = email;
      user.website = website;

      $http.put("http://poo-ihm-2015-rest.herokuapp.com/api/Users/"+id,user)
        .success(function(data) {
          $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + $routeParams.userId)
            .success(function(data) {
              $scope.currentUser = data.data;
            }
          )
        })


    }



    $scope.deleteUser = function(id){
      $http.delete("http://poo-ihm-2015-rest.herokuapp.com/api/Users/"+id)
        .success(function(data) {
          $scope.getAllUsers();
        })
    }


    $scope.getRoles = function(id){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + id+'/Roles').success(
        function(data){
          if (data.status == "success") $scope.currentRoles = data.data;
        }
      )
    }


    $scope.getProjects = function(id){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + id+'/Projects').success(
        function(data){
          for (var i = 0;i<data.data.length;i++) {
            $scope.projectTitles[data.data[i].id] = data.data[i].title;
            $scope.projectYears[data.data[i].id] = data.data[i].year;
          }
        }
      )
    }

    $scope.deleteProjectUser = function(projectId,userId) {
      $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Users/' + userId + '/Projects/' + projectId)
        .success( function(data) {
          $scope.getRoles($routeParams.userId);
        }
      )
    }

    $scope.addProjectUser = function(title,year,userId,role){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects?title='+title+'&year='+year)
        .success(function(data) {
          if (data.count == 0){
            document.getElementById('notfound').innerHTML = "Aucun projet trouvé ayant pour nom "+title+' datant de '+year;
            return;
          }
          document.getElementById('notfound').innerHTML = "";
          var projectId = data.data[0].id;
          var rol = {};
          rol.name = role;
          rol.UserId =  userId;
          rol.ProjectId = projectId;

          $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Roles/',rol)
            .success( function(data) {
              $scope.getRoles(userId);
              $scope.getProjects(userId);
            })

        })
    }

  }]);
