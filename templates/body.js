'use strict';

const _ = require('underscore');

function tr(event) {
  function videoCell() {
    return event.videoUrl ?
      `
        <img src="${event.videoThumbnail}"
             class="thumbnail"
             onclick="loadVideo(this)"
             data-video-url="${event.videoUrl}">
        </img>
      ` :
      'No video found';
  }
  return `
    <tr>
      <td>${event.start.datetime}</td>
      <td>${event.displayName}</td>
      <td>${event.venue.displayName}</td>
      <td><a href="${event.uri}">GO!</a></td>
      <td>${ videoCell() }</td>
    </tr>
  `;
}

function pagination(data) {
  function pageUrl(pageNumber) {
    const href = '/?pageNumber=' + pageNumber;
    return `<a href=${href}>${pageNumber}</a>`;
  }
  console.log('currentPage: ' + data.currentPage);
  return _.range(1, data.totalPages)
    .map(function(pageNumber) {
      return pageNumber == data.currentPage ?
        String(pageNumber) :
        pageUrl(pageNumber);
    })
    .join('&nbsp;');
}

module.exports = function(data) {
  return `
    <h1>${data.title}</h1>
    
    <p>
      Event data from
      <a href="http://www.songkick.com">
        <img src="img/sm_logo.png" alt="Songkick.com"></img>
      </a>
    </p>

    <p class="pagination">${ pagination(data) }</p>

    <table class="event-listings">
      <thead>
        <tr>
          <th>Date</th>
          <th>Artists</th>
          <th>Venue</th>
          <th>Link</th>
          <th>Video</th>
        </tr>
      </thead>
      <tbody>
        ${ data.events.map(tr).join('') }
      </tbody>
    </table>

    <p class="pagination">${ pagination(data) }</p>
  `;
};
