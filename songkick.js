'use strict';

let request = require('request');
let _ = require('underscore');

let testResponse = require('./testCalendar.json');
let apiKeys = require('./api_keys.json');

function CalendarResponse(json) {
  var response = JSON.parse(json);
  this.events = response.resultsPage.results.event;
  this.totalPages = Math.ceil(response.resultsPage.totalEntries / response.resultsPage.perPage);
}

let songkick = {};

let METRO_AREA_ID = '22443';
let CALENDAR_URL = `http://api.songkick.com/api/3.0/metro_areas/${METRO_AREA_ID}/calendar.json?apikey=${apiKeys.songkick}`;

/**
 * Get events and pagination info
 */
songkick.getEvents = function(options) {
  let pageNumber = options.pageNumber;
  let lat = options.lat;
  let lon = options.lon;
  console.log(lat, lon);
  
  return new Promise(function(resolve, reject) {
    let requestUrl = CALENDAR_URL + `&page=${pageNumber}`;
    request(requestUrl, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let calendarResponse = new CalendarResponse(body);
        resolve({
          events: calendarResponse.events,
          totalPages: calendarResponse.totalPages
        });
      } else {
        reject(error || 'Something went wrong... status code was ' + response.statusCode);
      }
    }); // request
  }); // new Promise

  //return Promise.resolve((new CalendarResponse(JSON.stringify(testResponse))).getEvents());
};

module.exports = songkick;
