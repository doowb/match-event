/*!
 * match-event <https://github.com/doowb/match-event>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var define = require('define-property');

/**
 * Register an event listener that will only be called when a string is passed that matches the given regex or string literal.
 *
 * @param  {String} `event` Event name to pass to the emitter `on` method.
 * @param  {String|RegExp} `re` String or RegExp pattern to match.
 * @param  {Function} `fn` Event listener function to pass to the emitter `on` method.
 * @return {Object} Return `this` for chaining.
 * @api public
 */

module.exports = function () {
  return function (app) {
    var origOn = app.on;

    var on = function(event, re, fn) {
      if (typeof re === 'function') {
        return origOn.call(app, event, re);
      }

      var listener = function(fp) {
        if (typeof re === 'string') {
          if (re === fp) {
            return fn.apply(app, arguments);
          }
          return;
        }
        if(re.test(fp)) {
          return fn.apply(app, arguments);
        }
      };

      // this allows default `off` functionality in component-emitter
      listener.fn = fn;
      return origOn.call(app, event, listener);
    };

    // define methods to override default component-emitter methods
    define(app, 'on', on);
    define(app, 'addEventListener', on);
  };
};
