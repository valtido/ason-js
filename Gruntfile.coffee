module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    clean:
      options:
        force: true
      files: ['lib/**/*','lib/*main*']
    watch:
      scripts:
        files: ['src/**/*.coffee']
        tasks: ['clean','coffee']
    coffee:
      compileWithMapsDir:
        options:
          bare: true
          sourceMap: true
          joinExt: '_src.js'
        files:
          'lib/main.js': [
            'src/all/_utils.coffee'
            'src/all/_AssetManager.class.coffee'
            'src/all/Shadow.class.coffee'
            'src/all/Collections.class.coffee'
            'src/all/Components.class.coffee'
            'src/all/Observe.class.coffee'
            'src/all/Templates.class.coffee'
            'src/all/JOM.class.coffee'
          ]




  # Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"
  # Default task(s).
  grunt.registerTask "default", ["clean", "coffee", "watch" ]
