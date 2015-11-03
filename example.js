'use strict';

var Emitter = require('component-emitter');
var match = require('./');

function App() {
  if (!(this instanceof App)) {
    return new App();
  }
}

Emitter(App.prototype);

var app = new App();
match()(app);

app.on('foo', /\.js$/, function(fp, file) {
  console.log(arguments);
});

app.on('foo', 'package.json', function(fp, file) {
  console.log(arguments);
});

app.emit('foo', 'foo.js', {path: 'foo.js'});
app.emit('foo', 'foo.json', {path: 'foo.js'});
