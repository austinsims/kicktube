'use strict';

const _ = require('underscore');

function tr(event) {
  function videoCell() {
    return event.videoId ?
      `
        <img src="${event.videoThumbnail}"
             class="thumbnail"
             onclick="loadVideo(this)"
             data-video-id="${event.videoId}">
        </img>
      ` :
      'No video found';
  }
  return `
    <tr>
      <td>${event.date}</td>
      <td>${event.displayName}</td>
      <td>${event.venue.displayName}</td>
      <td><a href="${event.uri}">GO!</a></td>
      <td>${ videoCell() }</td>
    </tr>
  `;
}

function pagination(data) {
  function pageLink(pageNumber, innerText) {
    function setParamValue(key, value) {
      return '/events?' +
        _.pairs(_.extend(data.query, _.object([[key, value]])))
        .map(kv => kv.join('='))
        .join('&');
    }
    const href = setParamValue('pageNumber', pageNumber);
    return `<a href=${href}>${innerText}</a>`;
  }
  
  function numbers() {
    return _.range(1, data.totalPages)
      .map(function(pageNumber) {
        return pageNumber == data.currentPage ?
          String(pageNumber) :
          pageLink(pageNumber, pageNumber);
      })
      .join('&nbsp;');
  }

  return [
      data.currentPage > 1 ?
        pageLink(data.currentPage - 1, '<') :
        '',
      numbers(),
      data.currentPage != data.totalPages - 1 ?
        pageLink(data.currentPage + 1, '>') :
        '',
    ].join('&nbsp;&nbsp;&nbsp;');
}

function table(data) {
  return `

  `;
}

module.exports = function(data) {
  return [`
    <h1>Kicktube</h1>
    <h3>A mashup of Songkick and Youtube</h3>
    
    <p>
      Event data from
      <a href="http://www.songkick.com">
        <img src="img/sm_logo.png" alt="Songkick.com"></img>
      </a>
    </p>`,

    data.events.length ? `<p class="pagination">${ pagination(data) }</p>

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
    <script src='js/events.js'></script>
  ` : '<p>No events found.</p>'].join('');
};
