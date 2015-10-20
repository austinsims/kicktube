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

let calendarUrl = (metroAreaId) => `http://api.songkick.com/api/3.0/metro_areas/${metroAreaId}/calendar.json?apikey=${apiKeys.songkick}`;
let locationSearchUrl = (lat, lon) => `http://api.songkick.com/api/3.0/search/locations.json?location=geo:${lat},${lon}&apikey=${apiKeys.songkick}`;

function getMetroAreaId(lat, lon) {
  return new Promise(function(resolve, reject) {
    let requestUrl = locationSearchUrl(lat, lon);
    request(requestUrl, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        let json = JSON.parse(body);
        if (json && json.resultsPage && json.resultsPage.results && json.resultsPage.results.location && json.resultsPage.results.location.length) {
          console.log(body);
          resolve(json.resultsPage.results.location[0].metroArea.id);
        } else {
          reject('No metro area found for coordinates.');
        }
      } else {
        reject(error || 'Something went wrong... status code was ' + response.statusCode);
      }
    });
  });
}

/**
 * Get events and pagination info
 */
songkick.getEvents = function(options) {
  let pageNumber = options.pageNumber;
  let lat = options.lat;
  let lon = options.lon;
  
  return new Promise(function(resolve, reject) {
    getMetroAreaId(lat, lon).then(function(metroAreaId) {
      let requestUrl = calendarUrl(metroAreaId) + `&page=${pageNumber}`;
      console.log('requestUrl: ' + requestUrl);
      request(requestUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          let calendarResponse = new CalendarResponse(body);
          console.log('events response body: ' + body);
          resolve({
            events: calendarResponse.events || [],
            totalPages: calendarResponse.totalPages
          });
        } else {
          reject(error || 'Something went wrong... status code was ' + response.statusCode);
        }
      }); // request
    }).catch(reject); // getMetroAreaId.then
  }); // new Promise

  //return Promise.resolve((new CalendarResponse(JSON.stringify(testResponse))).getEvents());
};

module.exports = songkick;
