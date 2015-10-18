'use strict';

const _ = require('underscore');

const scripts = [
  'components/underscore/underscore.js',
  'js/app.js',
];

const body = function(data) {
  return `
    <h1>Hello, win sauce blah</h1>
  `;
}

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
