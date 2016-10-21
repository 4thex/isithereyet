var app = angular.module('app', []);

app.controller('AppController', function AppController($scope, $http) {
    $scope.next = {};
    $scope.next.pending = true;
    var update = function(latitude, longitude) {
        var time = new Date();
        var offset = time.getTimezoneOffset();
        $http
            .post('api/service/next', {
        	   // time: "2016-10-20T10:18:31-0700",
        	    time: time,
        	    offset: offset,
                latitude: latitude, 
                longitude: longitude
            })
            .then(function(response) {
                var wait = response.data.wait;
                var time = response.data.time;
                var stop = response.data.stop;
                
                if(response.data.time !== undefined) {
                    $scope.next.wait = `${wait.minutes} minutes and ${wait.seconds} seconds`;
                    $scope.next.time = time;
                }
                $scope.next.stop = stop;
                $scope.next.pending = false;
            });
    };
    
    navigator.geolocation.getCurrentPosition(function(position) {
        update(position.coords.latitude, position.coords.longitude);
    });
});