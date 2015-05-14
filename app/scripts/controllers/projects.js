'use strict';

/**
 * @ngdoc function
 * @name pooIhmExemplesApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pooIhmExemplesApp
 */
angular.module('pooIhmExemplesApp')
  .controller('ProjectsCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];



    $scope.getProjects = function(){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects')
        .success(function(data) {
          $scope.projects = data.data;
        })
    }


    $scope.getProjects();

    $scope.getCurrentProject = function(){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $routeParams.projectId)
        .success(function(data) {
          if (data.status == "success") {
            $scope.currentProject = data.data;
            $scope.getUsers($routeParams.projectId);
            $scope.roles = [];
            $scope.displayRoles($routeParams.projectId);

          }
        }
      )
    }

    if($routeParams.projectId) {
      $scope.getCurrentProject();
    }


    $scope.displayRoles = function(projectId){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/'+projectId+'/Roles')
        .success(function(data) {
          for (var i = 0; i < data.data.length; i++) {
            $scope.roles[data.data[i].UserId] = data.data[i].name;
          }
        }
        )
    }

    $scope.getUsers = function(id){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/'+id+'/Users')
        .success(function(data) {
          $scope.currentUsers = data.data;
          $scope.displayRoles(id);

        }
      )
    }

    $scope.createProject = function(title,year,description){
      var project = {};
      project.title = title;
      project.year = year;
      project.description = description;
      $http.post("http://poo-ihm-2015-rest.herokuapp.com/api/Projects/",project)
        .success(function(data){
          $scope.getProjects();
        }
        )

    }

    $scope.updateProject = function(id,title,year,description){
      var project = {};
      project.title = title;
      project.year = year;
      project.description = description;
      $http.put("http://poo-ihm-2015-rest.herokuapp.com/api/Projects/"+id,project)
        .success(function(data) {
          $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + $routeParams.projectId)
            .success(function (data) {
              if (data.status == "success") {
                $scope.currentProject = data.data;
              }
            }
          )
        }
      )

    }

    $scope.deleteProject = function(id){
        $http.delete("http://poo-ihm-2015-rest.herokuapp.com/api/Projects/"+id)
          .success(function(data){
            $scope.getProjects();
          }
        )

    }

    $scope.addUserProject = function(name,surname,projectId,role){
      $http.get('http://poo-ihm-2015-rest.herokuapp.com/api/Users?name='+name+'&surname='+surname)
        .success(function(data) {
          if (data.count == 0){
            document.getElementById('notfound').innerHTML = "Aucun utilisateur trouvé ayant pour nom "+name+' '+surname;
            return;
          }
          document.getElementById('notfound').innerHTML = "";
          var userId = data.data[0].id;
          var rol = {};
          rol.name = role;
          rol.UserId =  userId;
          rol.ProjectId = projectId;

          $http.post('http://poo-ihm-2015-rest.herokuapp.com/api/Roles/',rol)
            .success( function(data) {
              $scope.getUsers(projectId);
            })

        })
    }

    $scope.deleteUserProject = function(userId,projectId) {
      $http.delete('http://poo-ihm-2015-rest.herokuapp.com/api/Projects/' + projectId + '/Users/' + userId)
        .success( function(data) {
          $scope.getUsers(projectId);
        }
      )
    }


  }]);
