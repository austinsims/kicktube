'use strict';

let request = require('request');
let _ = require('underscore');

let testResponse = require('./testCalendar.json');
let apiKeys = require('./api_keys.json');

function CalendarResponse(json) {
  var response = JSON.parse(json);
  this.events = response.resultsPage.results.event;
}
CalendarResponse.prototype.getEvents = function() {
  return this.events;
};

let songkick = {};

let METRO_AREA_ID = '22443';
let CALENDAR_URL = `http://api.songkick.com/api/3.0/metro_areas/${METRO_AREA_ID}/calendar.json?apikey=${apiKeys.songkick}`;
console.log(CALENDAR_URL);

songkick.getEvents = function() {
  return new Promise(function(resolve, reject) {
    request(CALENDAR_URL, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let calendarResponse = new CalendarResponse(body);
        resolve(calendarResponse.getEvents());
      } else {
        reject(error || 'Something went wrong... status code was ' + response.statusCode);
      }
    }); // request
  }); // new Promise

  //return Promise.resolve((new CalendarResponse(JSON.stringify(testResponse))).getEvents());
};

module.exports = songkick;
