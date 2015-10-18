'use strict';

const _ = require('underscore');
const body = require('./body');

const scripts = [
  'components/underscore/underscore.js',
  'js/app.js',
];

const html = function(data) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>${data.title}</title>
        <link rel="stylesheet" href="/css/style.css">
      </head>
      <body>
        ${ body(data) }
        ${ scripts.map(src => '<script src=' + src + '></script>').join('\n') }
      </body>
    </html>
  `;
};

module.exports = {
  render: html
};
