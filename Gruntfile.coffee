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
        'public/assets/js/jom.js'
        'dist/**/*'
        'coverage'
      ]

    concat:
      core:
        src: [
          # 'bower_components/jquery/dist/jquery.js'
          # 'bower_components/jjv/lib/jjv.js'
          'src/observe.js'
          'src/utils.js'
          'src/asset.js'
          'src/shadow.js'
          'src/collection.js'
          'src/component.js'
          'src/template.js'
          'src/jom.js'
        ]
        dest: 'dist/<%= pkg.name %>.js'
      tests:
        src: ["test/unit/**/*.js"]
        dest: 'test/unit.js'
      copy:
        src: "<%= concat.core.src %>"
        dest: 'public/assets/js/jom.js'
      copy_min:
        src: "dist/jom.min.js"
        dest: 'public/assets/js/jom.min.js'
      copy_map:
        src: "dist/jom.min.js.map"
        dest: 'public/assets/js/jom.min.js.map'

    uglify:
      core:
        options:
          preserveComments: false
          sourceMap: true
          # sourceMapName: "dist/jom.min.map"
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
          # sourceMapName: "test/unit/all.min.map"
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
          'test/unit.min.js': 'test/unit.js'
    karma:
      ff:
        configFile: 'test/karma.config.js'
        singleRun: true
        browsers: ['Firefox']
      chrome:
        configFile: 'test/karma.config.js'
        singleRun: true
        force: true
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
      files: [ "src/**/*.coffee", "test/**/*.coffee" ]
      tasks: ['build', 'karma:dev']
  # Load the plugin that provides the "autoload" task.

  # Default task(s).
  grunt.registerTask "build", [
    "clean"
    "concat:*:*"
    "uglify:*:*"
    # "copy:*:*"
    "compare_size"
  ]
  grunt.registerTask "test",
    ['build',"karma:single"]

  grunt.registerTask "dev", ["build", "karma:chrome","watch"]
  grunt.registerTask "default", ["build", "karma:chrome"]
