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
      files: [
        'public/assets/js/jom.js'
        'public/assets/js/jom.min.js'
        'public/assets/js/jom.min.js.map'
        'src/**/*.js'
        'test/unit/**/*.js'
        'dist/**/*'
        'coverage'
      ]

    coffee:
        src:
            options:
                bare: true
            expand: true
            flatten: true
            cwd: 'src'
            src: ['*.coffee']
            dest: 'src'
            ext: '.js'
        test:
            options:
                bare: true
            expand: true
            flatten: true
            cwd: 'test/unit'
            src: ['*.coffee']
            dest: 'test/unit'
            ext: '.js'
    concat:
      core:
        src: [
          # 'bower_components/jquery/dist/jquery.js'
          'src/utils.js'
          # 'public/bower_components/webcomponentsjs/webcomponents.js'
          'public/assets/-/is-my-json-valid/is-my-json-valid.min.js'
          'src/handle.js'
          'src/observe_fallback.js'
          'src/observe.js'
          'src/asset.js'
          'src/shadow.js'
          'src/collection.js'
          'src/component.js'
          'src/template.js'
          'src/schema.js'
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
        singleRun: false
        browsers: ['Chrome']
      unit:
        configFile: 'test/karma.config.js'
        background: true
        singleRun: false

    watch:
      files: [ "src/**/*.coffee", "test/**/*.coffee" ]
      tasks: ['build']
  # Load the plugin that provides the "autoload" task.


  grunt.registerTask "test",
    ['build',"karma:chrome"]

  grunt.registerTask "clear", ["clean"]
  grunt.registerTask "builder", ["build","watch"]
  grunt.registerTask "dev", ["build", "karma:dev","watch"]
  # grunt.registerTask "default", ["build", "karma:chrome"]
  grunt.registerTask "build", ["clean",'coffee','concat','uglify','compare_size']
  grunt.registerTask "default", ['test']
