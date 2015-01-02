module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    clean:
      build: ['/lib']
    watch:
      scripts:
        files: ['src/**/*.coffee']
        tasks: ['clean:build','coffee']
    coffee:
      compileWithMapsDir:
        options:
          bare: true
          sourceMap: true
          joinExt: '_src.js'
        files:
          'lib/all.js': 'src/all/**/*.coffee'




  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"
  # Default task(s).
  grunt.registerTask "default", ["clean", "coffee", "watch" ]
