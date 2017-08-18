//Configure API key and options for OpenWeatherMap location here
const API_KEY = '';
const OWM_LOCATION = '';

const OWM_URL_CURRENT = 'http://api.openweathermap.org/data/2.5/weather?units=metric&lang=de';
const OWM_URL_FORECAST = 'http://api.openweathermap.org/data/2.5/forecast/daily?cnt=1&units=metric&lang=de'

const FBS_URL_DEVICE_LIST = '/fb-switch/get_devices.php';
const FBS_URL_DEVICE_SEND = '/fb-switch/index.php';

var app = angular.module('dashboardApp', ['toaster']);
app.controller('powerswitchController', function($scope, $http, $httpParamSerializerJQLike, toaster) {
    $http.get(FBS_URL_DEVICE_LIST).then(function(response) {
        //devices are seperated with a pipe character
        var devicesStr = response.data.split('|');
        //rooms is an object, whose keys/property names are the name of a room 
        //and the value is an array of objects with the devices/switches
        var rooms = {}; 
        for(var i = 0; i < devicesStr.length; i++) {
            //individual fields are seperated with a colon
            var fields = devicesStr[i].split(':');
            var device = {
                id: fields[0],
                name: fields[1],
                room: fields[2],
                type: fields[5],
                //used internally to deactivate the buttons
                sending: {
                    on: false,
                    off: false,
                }
            };
            
            //if there's no property for this room in the object yet
            if(rooms[device.room] === undefined) {
                //add the property with an empty array
                rooms[device.room] = [];
            }
            
            rooms[device.room].push(device);
        }
        $scope.rooms = rooms;
    });

    $scope.send = function(device, action) {
        device.sending[action] = true;
        var data = { 'action': action, 'type': 'device', 'id': device.id };
        $http({
            url: FBS_URL_DEVICE_SEND,
            method: 'POST',
            data: $httpParamSerializerJQLike(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            } 
        }).then(function(response) {
            toaster.success(response.data);
        }, function(response) {
            toaster.error('Error sending signal', 'Failed to send ' + device.name + ':' + action);
        }).finally(function() {
            device.sending[action] = false;
        });
    };
});
app.controller('clockController', function($scope, $timeout, $http, toaster) {
    function getMillisecondsTillDayEnd() {
        var now = new Date();
        var timeout = (24*60*60*1000) - (now.getHours()*60*60*1000) - (now.getMinutes()*60*1000) - (now.getSeconds()*1000) - now.getMilliseconds();
        return timeout;
    }
    function updateClock() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        //prepend a leading 0 if required
        $scope.hours = hours <= 9 ? '0' + hours : hours;
        $scope.minutes = minutes <= 9 ? '0' + minutes : minutes;
        //calculate time till next minute starts. The clock needs to advance just once a minute ;)
        var timeout = (60 - now.getSeconds()) * 1000;
        $timeout(updateClock, timeout);
    }
    function updateDate() {
        var now = new Date();
        $scope.date = now;
        $timeout(updateDate, getMillisecondsTillDayEnd());
    }
    function updateCurrentWeather() {
        $http.get(OWM_URL_CURRENT + '&' + OWM_LOCATION + '&appid=' + API_KEY).then(function(response) {
            $scope.currentWeather = response.data;
        }, function(response) {
            toaster.error('Error retrieving currentWeather', response);
        });
        //we want to update the current weather data every 5 minutes
        $timeout(updateCurrentWeather, 5*60*1000);
    }
    function updateForecastWeather() {
        $http.get(OWM_URL_FORECAST + '&' + OWM_LOCATION + '&appid=' + API_KEY).then(function(response) {
            $scope.forecastWeather = response.data;
        }, function(response) {
            toaster.error('Error retrieving forecastWeather', response);
        });
        //we want to update the weather forecast data once the next day starts
        $timeout(updateForecastWeather, getMillisecondsTillDayEnd());
    }
    //update all once and thus start the loop
    updateClock();
    updateDate();
    updateCurrentWeather();
    updateForecastWeather();
});