'use strict';

var Emitter = require('component-emitter');
var matchEvent = require('./');

function App() {
  if (!(this instanceof App)) {
    return new App();
  }
}

Emitter(App.prototype);

var app = new App();
matchEvent()(app);

app.on('foo', /\.js$/, function(fp, file) {
  console.log('js', arguments);
});

app.on('foo', /\.json$/, function(fp, file) {
  console.log('json', arguments);
});

app.on('foo', 'package.json', function(fp, file) {
  console.log('package.json', arguments);
});

app.emit('foo', 'foo.js', {path: 'foo.js'});
app.emit('foo', 'foo.json', {path: 'foo.js'});
app.emit('foo', 'package.json', {path: 'package.json'});
