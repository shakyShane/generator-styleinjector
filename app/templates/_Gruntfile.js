'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %> - ' +
      '<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%%= grunt.template.today("yyyy") %> <%%= pkg.author.name %>;' +
      ' Licensed <%%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    dirs: {
      dist: '<%= assetPath %>/js/dist',
      sass: '<%= assetPath %>/css/scss',
      css: '<%= assetPath %>/css',
      js: '<%= assetPath %>/js'
    },
    files: {
      require: '<%%= dirs.js %>/vendor/require.min.js',
      amdModules: '<%%= dirs.dist %>/modules.js',
      combined: '<%%= dirs.dist %>/modules.combined.js',
      jsDist: '<%%= dirs.dist %>/modules.combined.min.js'
    },
    requirejs: {
      compile: {
        options: {
          name: 'config',
          mainConfigFile: '<%% dirs.js %>/config.js',
          out: '<%%= files.amdModules %>',
          optimize: 'none'
        }
      }
    },
    concat: {
      dist: {
        src: ['<%%= files.require %>', '<%%= files.amdModules %>'],
        dest: '<%%= files.combined %>'
      }
    },
    uglify: {
      dist: {
        src: '<%%= concat.dist.dest %>',
        dest: '<%%= files.jsDist %>'
      }
    },
    watch: {
      sass: {
        files: '<%%= dirs.sass %>/**/*.scss',
        tasks: ['compass:dev']
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: '<%%= dirs.sass %>',
          cssDir: '<%%= dirs.css %>',
          environment: 'production',
          outputStyle: 'compressed'
        }
      },
      dev: {
        options: {
          sassDir: '<%%= dirs.sass %>',
          cssDir: '<%%= dirs.css %>',
          outputStyle: 'expanded'
        }
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Custom Tasks
  grunt.registerTask('default', ['requirejs', 'concat', 'uglify']);
//  grunt.registerTask('dev-watch', ['livereload-start', 'watch']); // Use this if you want live-reload
  grunt.registerTask('dev-watch', ['watch']);

};
