/*!
 * match-event <https://github.com/doowb/match-event>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var assert = require('assert');

var Emitter = require('component-emitter');
var Base = require('base-methods');
var matchEvent = require('./');

describe('match-event', function () {
  it('should add an event listener with default functionality', function () {
    function MyApp() {}
    Emitter(MyApp.prototype);
    var app = new MyApp();
    matchEvent()(app);

    var count = 0;
    var output = [];

    app.on('foo', function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    app.on('bar', function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    app.emit('foo', 'bar');
    app.emit('bar', 'baz');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar', 'bar-baz']);
  });

  it('should add an event listener using a string pattern', function () {
    function MyApp() {}
    Emitter(MyApp.prototype);
    var app = new MyApp();
    matchEvent()(app);

    var count = 0;
    var output = [];

    app.on('foo', 'bar', function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    app.on('bar', 'baz', function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    app.emit('foo', 'bar');
    app.emit('foo', 'baz');
    app.emit('bar', 'baz');
    app.emit('bar', 'bang');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar', 'bar-baz']);
  });

  it('should remove an event listener using a string pattern', function () {
    function MyApp() {}
    Emitter(MyApp.prototype);
    var app = new MyApp();
    matchEvent()(app);

    var count = 0;
    var output = [];

    function foo(msg) {
      count++;
      output.push('foo-' + msg);
    }

    app.on('foo', 'bar', foo);

    app.on('bar', 'baz', function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    app.emit('foo', 'bar');
    app.emit('foo', 'baz');
    app.emit('bar', 'baz');
    app.emit('bar', 'bang');

    app.off('foo', foo);

    app.emit('foo', 'bar');
    app.emit('foo', 'baz');
    app.emit('bar', 'baz');
    app.emit('bar', 'bang');

    assert.equal(count, 3);
    assert.deepEqual(output, ['foo-bar', 'bar-baz', 'bar-baz']);
  });

  it('should add an event listener using a RegExp pattern', function () {
    function MyApp() {}
    Emitter(MyApp.prototype);
    var app = new MyApp();
    matchEvent()(app);

    var count = 0;
    var output = [];

    app.on('foo', /\.json$/, function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    app.on('bar', /\.md$/, function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    app.emit('foo', 'bar.json');
    app.emit('foo', 'baz.md');
    app.emit('bar', 'baz.md');
    app.emit('bar', 'bang.json');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar.json', 'bar-baz.md']);
  });

  it('should remove an event listener using a RegExp pattern', function () {
    function MyApp() {}
    Emitter(MyApp.prototype);
    var app = new MyApp();
    matchEvent()(app);

    var count = 0;
    var output = [];

    function foo(msg) {
      count++;
      output.push('foo-' + msg);
    }

    app.on('foo', /\.json$/, foo);

    app.on('bar', /\.md$/, function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    app.emit('foo', 'bar.json');
    app.emit('foo', 'baz.md');
    app.emit('bar', 'baz.md');
    app.emit('bar', 'bang.json');

    app.off('foo', foo);

    app.emit('foo', 'bar.json');
    app.emit('foo', 'baz.md');
    app.emit('bar', 'baz.md');
    app.emit('bar', 'bang.json');

    assert.equal(count, 3);
    assert.deepEqual(output, ['foo-bar.json', 'bar-baz.md', 'bar-baz.md']);
  });

  it('should work as a plugin to base-methods in constructor', function () {
    function MyApp() {
      Base.call(this);
      this.use(matchEvent());
    }
    Base.extend(MyApp);
    Emitter(MyApp.prototype);
    var app = new MyApp();

    var count = 0;
    var output = [];

    app.on('foo', /\.json$/, function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    app.on('bar', /\.md$/, function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    app.emit('foo', 'bar.json');
    app.emit('foo', 'baz.md');
    app.emit('bar', 'baz.md');
    app.emit('bar', 'bang.json');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar.json', 'bar-baz.md']);
  });

  it('should work as a plugin to base-methods on instance', function () {
    function MyApp() {
      Base.call(this);
    }
    Base.extend(MyApp);
    Emitter(MyApp.prototype);
    var app = new MyApp();
    app.use(matchEvent());

    var count = 0;
    var output = [];

    app.on('foo', /\.json$/, function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    app.on('bar', /\.md$/, function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    app.emit('foo', 'bar.json');
    app.emit('foo', 'baz.md');
    app.emit('bar', 'baz.md');
    app.emit('bar', 'bang.json');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar.json', 'bar-baz.md']);
  });
});
