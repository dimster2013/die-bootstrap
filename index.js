var compiled = null;

module.exports = function(opts, cb) {
  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }

  var path = require('path'),
      recess = require('recess'),
      bootstrapSrc = path.resolve(__dirname + '/less/bootstrap.less'),
      responsiveSrc = path.resolve(__dirname + '/less/responsive.less');

  if (compiled) {
    return cb(null, compiled);
  }

  recess(bootstrapSrc, {compile: true}, function(err, obj) {
    if (err) {
      return cb(err);
    }

    compiled = obj.output;

    if (opts.responsive) {
      recess(responsiveSrc, {compile: true}, function(err, obj) {
        if (err) {
          return cb(err);
        }

        compiled += obj.output;

        cb(null, compiled);
      });
    } else {
      cb(null, compiled);
    }
  });
};
