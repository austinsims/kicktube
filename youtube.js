'use strict';

let google = require('googleapis');
let apiKeys = require('./api_keys.json');

let youtube = google.youtube('v3');

function videoIdToUrl(id) {
  return `http://www.youtube.com/v/${id}&autoplay=0`;
}

module.exports = {
  /**
   * Search for a given query string and return an iframe src for an embedded
   * video, video ID, or undefined if there were no results.
   */
  search: function(query) {
    return new Promise(function(resolve, reject) {
      youtube.search.list({key: apiKeys.youtube, part: 'snippet', q: query}, function(err, res) {
        if (err) reject(err);
        else if (!res.items.length) resolve(undefined); // no video found
        else if (!res.items[0].id.videoId) resolve(undefined) // ???
        else resolve(videoIdToUrl(res.items[0].id.videoId));
      });
    });
  }
};
