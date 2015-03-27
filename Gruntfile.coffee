module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)
  readOptionalJSON = (filepath) ->
    data = {}
    try
      data = grunt.file.readJSON(filepath)
    catch e
    data
  gzip = require( "gzip-js" )
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    dst: readOptionalJSON "dist/.destination.json"
    "compare_size":
      files: [ "dist/<%= pkg.name %>.js", "dist/<%= pkg.name %>.min.js" ]
      options:
        compress:
          gz: ( contents )-> return gzip.zip( contents, {} ).length
        cache: "build/.sizecache.json"

    clean:
      options:
        force: true
      files: [
        'src/js/**/*'
        'src/map/**/*'
        'dist/**/*'
        'test/unit/js/**/*.js'
        'coverage'
      ]
    coffee:
      source:
        expand: true
        cwd: "src/coffee/"
        src: ["**/*.coffee"]
        dest: "src/js/"
        ext: ".js"
        options:
          bare: true
          sourceMap:false
          sourceMapDir: "src/map/"
      tests:
        expand: true
        cwd: "test/unit/coffee/"
        src: ["**/*.coffee"]
        dest: "test/unit/js/"
        ext: ".js"
        options:
          bare: true
          sourceMap:true
          sourceMapDir: "test/unit/map/"


    concat:
      core:
        src: [
          # 'bower_components/jquery/dist/jquery.js'
          # 'bower_components/jjv/lib/jjv.js'
          'src/js/observer.js'
          'src/js/_utils.js'
          'src/js/asset.js'
          'src/js/shadow.js'
          'src/js/collection.js'
          'src/js/component.js'
          'src/js/template.js'
          'src/js/jom.js'
        ]
        dest: 'dist/<%= pkg.name %>.js'
      tests:
        src: ["test/unit/js/**/*"]
        dest: 'test/unit/all.js'

    uglify:
      core:
        options:
          preserveComments: false
          sourceMap: false
          sourceMapName: "dist/jom.min.map"
          report: "min"
          mangle:
            toplevel: false
          beautify:
            "ascii_only": true
          banner: '/*! <%= pkg.name %> <%= pkg.version %> |
                  @author Valtid Caushi
                  @date <%= grunt.template.today("dd-mm-yyyy") %> */\n'
          compress:
            "hoist_funs": false
            loops: false
            unused: false
        files:
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
      tests:
        options:
          preserveComments: false
          sourceMap: true
          sourceMapName: "test/unit/all.min.map"
          report: "min"
          mangle:
            toplevel: false
          beautify:
            "ascii_only": true
          banner: '/*! <%= pkg.name %> <%= pkg.version %> |
                  @author Valtid Caushi
                  @date <%= grunt.template.today("dd-mm-yyyy") %> */\n'
          compress:
            "hoist_funs": false
            loops: false
            unused: false
        files:
          'test/unit/all.min.js': 'test/unit/all.js'
    karma:
      ff:
        configFile: 'test/karma.config.js'
        singleRun: true
        browsers: ['Firefox']
      chrome:
        configFile: 'test/karma.config.js'
        singleRun: true
        browsers: ['Chrome']
        # browsers: ['chrome_without_security']
      single:
        configFile: 'test/karma.config.js'
        singleRun: true
        browsers: ['PhantomJS']
      continuous:
        configFile: 'test/karma.config.js'
        singleRun: true
        browsers: ['PhantomJS']
      dev:
        configFile: 'test/karma.config.js'
        singleRun: true
        browsers: ['Chrome']
      unit:
        configFile: 'test/karma.config.js'
        background: true
        singleRun: false

    watch:
      files: [ "<%= coffee.source.src %>", "<%= coffee.tests.src %>" ]
      tasks: ['build', 'karma:dev']
  # Load the plugin that provides the "autoload" task.

  # Default task(s).
  grunt.registerTask "build", [
    "clean"
    # "coffee:source", "coffee:tests"
    "concat:*:*"
    "uglify:*:*"
    "compare_size"
  ]
  grunt.registerTask "test",
    ['build',"karma:single"]

  grunt.registerTask "dev", ["build", "karma:chrome","watch"]
  grunt.registerTask "default", ["build", "karma:single"]
