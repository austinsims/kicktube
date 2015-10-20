'use strict';

const _ = require('underscore');
const events = require('./events');

const libs = [
  'components/underscore/underscore.js',
];

const html = function(data, innerTemplate) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Kicktube</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        ${ innerTemplate(data) }
        ${ libs.map(src => '<script src=' + src + '></script>').join('\n') }
      </body>
    </html>
  `;
};

module.exports = html;
