 # RPi Touch Dashboard
 This is a personal repository with code for a dashboard-like webpage. The page runs on a Raspberry Pi with the official touch screen attached (full screen in Chromium). 
 
 It provides time, date and weather information as well as buttons for simple home automation with remote controlled sockets. The backend for this is provided by FB.Switch. 

 ## Requirements
 1. An active installation of FB.Switch (Webserver, PHP, Gateway for RC sockets...)
 2. An API key for OpenWeatherMap
 3. Webbrowser with current Javascript support (i.e. Chromium on Raspian on Raspberry Pi)

 ## Installation
 * Copy files into folder on the webserver
 * Adjust js/script.js:
   * add own API key and location according to documentation of OpenWeatherMap
   * change URL to installation location of FB.Switch if required

 ## Credits
 Thanks to the following projects used:
 * [FB.Switch](https://github.com/bombcheck/FB.Switch)
 * [OpenWeatherMap](http://www.openweathermap.org/api) (free API)
 * [AngularJS](https://angularjs.org)
 * [AngularJS-Toaster](https://github.com/jirikavi/AngularJS-Toaster)
 * [Bootstrap](https://getbootstrap.com) / [Bootswatch Darkly theme](https://bootswatch.com/darkly/)
 * [Weather Icons](https://erikflowers.github.io/weather-icons/)