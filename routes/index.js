'use strict';

let express = require('express');
let youtube = require('../youtube');
let songkick = require('../songkick');
let moment = require('moment');
let _ = require('underscore');
let router = express.Router();

/**
 * Filter down a Songkick API event to the bare minimum we need to send to the template,
 * with nicely formatted values
 */

function toDisplayEvents(apiEvents) {
  function toDisplayEvent(apiEvent) {
    let WHITELISTED_KEYS = [
      'start',
      'displayName',
      'venue',
      'uri',
      'performance', // TODO this isn't actually needed for display, but for search.
                     //      consider adding videos before filtering to display form.
    ];

    var displayEvent = _.pick(apiEvent, ...WHITELISTED_KEYS);

    // Format date
    // TODO remove mutation! PURE CODE!
    displayEvent.start.datetime =
      moment(displayEvent.start.datetime).format('dddd, MMMM Do YYYY');

    return displayEvent;
  }

  return apiEvents.map(toDisplayEvent);
}

function withYoutubeVideos(displayEvents) {
  function withYoutubeVideo(displayEvent) {
    return new Promise(function(resolve, reject) {
      youtube.search(displayEvent.performance[0].artist.displayName)
        .then(function(videoUrl) {
          displayEvent.videoUrl = videoUrl;
          resolve(displayEvent);
        })
        .catch(reject);
    });
  }
  return Promise.all(displayEvents.map(withYoutubeVideo));
}

router.get('/', function(req, res) {
  songkick.getEvents()
    .then(toDisplayEvents)
    .then(withYoutubeVideos)
    .then(function(events) {
      res.render('index', {
        title: 'Muzikz',
        events: events,
      });
    })
    .catch(function(reason) {
      console.error(reason + reason.stack);
      res.send('Error!!11!');
    });
});

module.exports = router;
