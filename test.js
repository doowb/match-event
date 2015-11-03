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
    function MyEmitter() {}
    Emitter(MyEmitter.prototype);
    var emitter = new MyEmitter();
    matchEvent()(emitter);

    var count = 0;
    var output = [];

    emitter.on('foo', function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    emitter.on('bar', function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    emitter.emit('foo', 'bar');
    emitter.emit('bar', 'baz');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar', 'bar-baz']);
  });

  it('should add an event listener using a string pattern', function () {
    function MyEmitter() {}
    Emitter(MyEmitter.prototype);
    var emitter = new MyEmitter();
    matchEvent()(emitter);

    var count = 0;
    var output = [];

    emitter.on('foo', 'bar', function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    emitter.on('bar', 'baz', function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    emitter.emit('foo', 'bar');
    emitter.emit('foo', 'baz');
    emitter.emit('bar', 'baz');
    emitter.emit('bar', 'bang');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar', 'bar-baz']);
  });

  it('should add an event listener using a RegExp pattern', function () {
    function MyEmitter() {}
    Emitter(MyEmitter.prototype);
    var emitter = new MyEmitter();
    matchEvent()(emitter);

    var count = 0;
    var output = [];

    emitter.on('foo', /\.json$/, function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    emitter.on('bar', /\.md$/, function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    emitter.emit('foo', 'bar.json');
    emitter.emit('foo', 'baz.md');
    emitter.emit('bar', 'baz.md');
    emitter.emit('bar', 'bang.json');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar.json', 'bar-baz.md']);
  });

  it('should work as a plugin to base-methods in constructor', function () {
    function MyEmitter() {
      Base.call(this);
      this.use(matchEvent());
    }
    Base.extend(MyEmitter);
    Emitter(MyEmitter.prototype);
    var emitter = new MyEmitter();

    var count = 0;
    var output = [];

    emitter.on('foo', /\.json$/, function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    emitter.on('bar', /\.md$/, function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    emitter.emit('foo', 'bar.json');
    emitter.emit('foo', 'baz.md');
    emitter.emit('bar', 'baz.md');
    emitter.emit('bar', 'bang.json');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar.json', 'bar-baz.md']);
  });

  it('should work as a plugin to base-methods on instance', function () {
    function MyEmitter() {
      Base.call(this);
    }
    Base.extend(MyEmitter);
    Emitter(MyEmitter.prototype);
    var emitter = new MyEmitter();
    emitter.use(matchEvent());

    var count = 0;
    var output = [];

    emitter.on('foo', /\.json$/, function (msg) {
      count++;
      output.push('foo-' + msg);
    });

    emitter.on('bar', /\.md$/, function (msg) {
      count++;
      output.push('bar-' + msg);
    });

    emitter.emit('foo', 'bar.json');
    emitter.emit('foo', 'baz.md');
    emitter.emit('bar', 'baz.md');
    emitter.emit('bar', 'bang.json');
    assert.equal(count, 2);
    assert.deepEqual(output, ['foo-bar.json', 'bar-baz.md']);
  });
});
