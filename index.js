/*!
 * match-event <https://github.com/doowb/match-event>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function (options) {
  return function (app) {
    var on = app.on;
    app.on = function(event, re, fn) {
      if (typeof re === 'function') {
        return on.call(app, event, re);
      }
      if (typeof re === 'string') {
        re = new RegExp(re);
      }
      on.call(app, event, function(fp) {
        if(re.test(fp)) {
          return fn.apply(null, arguments);
        }
      });
    };
  };
};
