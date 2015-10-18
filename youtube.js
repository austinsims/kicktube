'use strict';

let google = require('googleapis');
let apiKeys = require('./api_keys.json');

let youtube = google.youtube('v3');

function videoIdToUrl(id) {
  return `http://www.youtube.com/v/${id}&autoplay=1`;
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
        else {
          //console.log(JSON.stringify(res.items[0], null, 2));
          resolve({
            videoUrl: videoIdToUrl(res.items[0].id.videoId),
            videoThumbnail: res.items[0].snippet.thumbnails.default.url
          });
        }
      });
    });
  }
};
