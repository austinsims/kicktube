'use strict';

let express = require('express');
let youtube = require('../youtube');
let songkick = require('../songkick');
let moment = require('moment');
let _ = require('underscore');
let mainTemplate = require('../templates/html.js');
let geolocationTemplate = require('../templates/geolocation.js');
let eventsTemplate = require('../templates/events.js');
let router = express.Router();

/**
 * Filter down a Songkick API event to the bare minimum we need to send to the template,
 * with nicely formatted values
 * TODO: move all this crap to songkick.js
 */
function toDisplayEvents(apiEvents) {
  function toDisplayEvent(apiEvent) {
    let WHITELISTED_KEYS = [
      'displayName',
      'venue',
      'uri',
      'performance', // TODO this isn't actually needed for display, but for search.
                     //      consider adding videos before filtering to display form.
    ];

    var displayEvent = _.pick(apiEvent, ...WHITELISTED_KEYS);

    return _.extend(displayEvent, {
      date: moment(apiEvent.start.date, 'YYYY-MM-DD').format('dddd, MMMM Do')
    });
  }

  return apiEvents.map(toDisplayEvent);
}

function withYoutubeVideos(displayEvents) {
  function withYoutubeVideo(displayEvent) {
    return new Promise(function(resolve, reject) {
      youtube.search(displayEvent.performance[0].artist.displayName)
        .then(function(result) {
          if (result) {
            displayEvent.videoThumbnail = result.videoThumbnail;
            displayEvent.videoUrl = result.videoUrl;
          }
          resolve(displayEvent);
        })
        .catch(reject);
    });
  }
  return Promise.all(displayEvents.map(withYoutubeVideo));
}

router.get('/', function(req, res) {
  res.send(mainTemplate({}, geolocationTemplate));
});

router.get('/events', function(req, res) {
  let pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1;
  var totalPages;
  songkick.getEvents(pageNumber)
    .then(function(songkickResponse) {
      totalPages = songkickResponse.totalPages;
      return Promise.resolve(songkickResponse.events);
    })
    .then(toDisplayEvents)
    .then(withYoutubeVideos)
    .then(function(events) {
      res.send(
        mainTemplate({
          events,
          currentPage: pageNumber,
          totalPages,
          query: req.query,
        }, eventsTemplate)
      );
    })
    .catch(function(reason) {
      console.error(reason + reason.stack);
      res.send('Error!!11!');
    });
});

module.exports = router;
