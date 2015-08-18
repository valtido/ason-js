module.exports = function(grunt) {
  var gzip, readOptionalJSON;
  require('load-grunt-tasks')(grunt);
  readOptionalJSON = function(filepath) {
    var data, e;
    data = {};
    try {
      data = grunt.file.readJSON(filepath);
    } catch (_error) {
      e = _error;
    }
    return data;
  };
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    dst: readOptionalJSON("dist/.destination.json"),
    "compare_size": {
      files: ["dist/<%= pkg.name %>.js", "dist/<%= pkg.name %>.min.js"],
      options: {
        compress: {
          gz: function(contents) {
            return gzip.zip(contents, {}).length;
          }
        },
        cache: "build/.sizecache.json"
      }
    },
    clean: {
      options: {
        force: true
      },
      files: ['public/assets/js/jom.js', 'dist/**/*', 'coverage']
    },
    concat: {
      core: {
        src: ['public/assets/-/is-my-json-valid/is-my-json-valid.min.js', 'src/observe.js', 'src/utils.js', 'src/asset.js', 'src/shadow.js', 'src/collection.js', 'src/component.js', 'src/template.js', 'src/schema.js', 'src/jom.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      tests: {
        src: ["test/unit/**/*.js"],
        dest: 'test/unit.js'
      },
      copy: {
        src: "<%= concat.core.src %>",
        dest: 'public/assets/js/jom.js'
      },
      copy_min: {
        src: "dist/jom.min.js",
        dest: 'public/assets/js/jom.min.js'
      },
      copy_map: {
        src: "dist/jom.min.js.map",
        dest: 'public/assets/js/jom.min.js.map'
      }
    },
    uglify: {
      core: {
        options: {
          preserveComments: false,
          sourceMap: true,
          report: "min",
          mangle: {
            toplevel: false
          },
          beautify: {
            "ascii_only": true
          },
          banner: '/*! <%= pkg.name %> <%= pkg.version %> | @author Valtid Caushi @date <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          compress: {
            "hoist_funs": false,
            loops: false,
            unused: false
          }
        },
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
        }
      },
      tests: {
        options: {
          preserveComments: false,
          sourceMap: true,
          report: "min",
          mangle: {
            toplevel: false
          },
          beautify: {
            "ascii_only": true
          },
          banner: '/*! <%= pkg.name %> <%= pkg.version %> | @author Valtid Caushi @date <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          compress: {
            "hoist_funs": false,
            loops: false,
            unused: false
          }
        },
        files: {
          'test/unit.min.js': 'test/unit.js'
        }
      }
    },
    karma: {
      ff: {
        configFile: 'test/karma.config.js',
        singleRun: true,
        browsers: ['Firefox']
      },
      chrome: {
        configFile: 'test/karma.config.js',
        singleRun: true,
        force: true,
        browsers: ['Chrome']
      },
      single: {
        configFile: 'test/karma.config.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },
      continuous: {
        configFile: 'test/karma.config.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },
      dev: {
        configFile: 'test/karma.config.js',
        singleRun: true,
        browsers: ['Chrome']
      },
      unit: {
        configFile: 'test/karma.config.js',
        background: true,
        singleRun: false
      }
    },
    watch: {
      files: ["src/**/*.coffee", "test/**/*.coffee"],
      tasks: ['build', 'karma:dev']
    }
  });
  grunt.registerTask("build", ["clean", "concat:*:*", "uglify:*:*", "compare_size"]);
  grunt.registerTask("test", ['build', "karma:single"]);
  grunt.registerTask("dev", ["build", "karma:chrome", "watch"]);
  return grunt.registerTask("default", ["build", "karma:chrome"]);
};
