var compiledCss = null,
    compiledJs  = null;

exports.css = function(opts) {
  return function(cb) {
    if (typeof opts == 'function') {
      cb = opts;
      opts = {};
    }

    var path = require('path'),
        recess = require('recess'),
        bootstrapSrc = path.resolve(__dirname + '/less/bootstrap.less'),
        responsiveSrc = path.resolve(__dirname + '/less/responsive.less');

    if (compiledCss) {
      return cb(null, compiledCss);
    }

    recess(bootstrapSrc, {compile: true}, function(err, obj) {
      if (err) {
        return cb(err);
      }

      compiledCss = obj.output;

      if (opts.responsive) {
        recess(responsiveSrc, {compile: true}, function(err, obj) {
          if (err) {
            return cb(err);
          }

          compiledCss += obj.output;

          cb(null, compiledCss);
        });
      } else {
        cb(null, compiledCss);
      }
    });
  };
};

exports.js = function(opts) {
  return function(cb) {
    if (typeof opts == 'function') {
      cb = opts;
      opts = {};
    }

    var fs = require('fs'),
        path = require('path'),
        jsPath = path.resolve(__dirname + '/js');

    if (compiledJs) {
      return cb(null, compiledJs);
    } else {
      compiledJs = '';
    }

    var selected = function(file) {
      if (!opts.only) {
        return true;
      }

      for (var i=0, length=opts.only.length; i<length; i++) {
        var pattern = new RegExp('bootstrap-' + opts.only[i] + '.*.js');
        if (file.match(pattern))
          return true;
      }
      return false;
    };

    fs.readdir(jsPath, function(err, files) {
      var count = 0;

      files.filter(function(file) {
        if (file.match(/bootstrap-.*.js/) && selected(file)) {
          count += 1;

          fs.readFile(path.join(jsPath, file), function(err, body) {
            compiledJs += body;
            count -= 1;
            if (count === 0) {
              cb(null, compiledJs);
            }
          });
        }
      });
    });
  };
};
