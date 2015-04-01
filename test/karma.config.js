// Karma configuration
// Generated on Tue Aug 19 2014 10:58:18 GMT+0100 (GMT Daylight Time)
module.exports = function(config) {

  var sourcePreprocessors = 'coverage';
  function isDebug(argument) {
      return argument === '--debug';
  }
  if (process.argv.some(isDebug)) {
      sourcePreprocessors = [];
  }

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // {pattern: 'test/helper.js', included: true},
      {pattern: 'public/bower_components/webcomponentsjs/webcomponents.js', included: false},
      {pattern: 'public/bower_components/jquery/dist/jquery.js', included: true},
      {pattern: 'test/_helper.js', included: true},
      {pattern: 'public/bower_components/jjv/lib/jjv.js', included: true},
      {pattern: 'dist/jom.js', included: true},
      {pattern: 'test/unit.js', included: true}
      // {pattern: 'test/unit/all.min.map', included: false}
    ],


    // list of files to exclude
    exclude: [    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul via Ibrik unless
      // specified otherwise in coverageReporter.instrumenter)
      // 'src/**/*.coffee': ['coffee'],
      'dist/jom.js': sourcePreprocessors,
      // 'dest/jom.js': ['coverage'],
      // 'src/**/*.js': ['coverage'],

      // note: project files will already be converted to
      // JavaScript via coverage preprocessor.
      // Thus, you'll have to limit the CoffeeScript preprocessor
      // to uncovered files.
      // 'test/**/*.coffee': ['coffee'],
      // 'test/unit.js': ['coverage'],
      // 'test/**/*.js': ['coverage']
    },

    coffeePreprocessor: {
      // options passed to the coffee compiler
      options: {
       bare: true,
       sourceMap: true
      },
      // transforming the filenames
      transformPath: function(path) {
       return path.replace(/\.coffee$/, '.js');
      }
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'public/coverage/',
      subdir: function(browser) {
        // normalization process to keep a consistent browser name accross different
        // OS
        return browser.toLowerCase().split(/[ /-]/)[0];
      }
    },
    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // 'chrome_without_security'
    // 'firefox_without_security'
    // 'Safari','Firefox'
    browsers: ['Chrome'],

      customLaunchers : {
       chrome_without_security: {
         base: "Chrome",
         flags : ["--disable-web-security", "--harmony"]
       },
       firefox_without_security: {
         base: "Firefox",
         flags : "--disable-web-security"
       }
      },

    captureTimeout: 60000,
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
