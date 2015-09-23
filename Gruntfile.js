module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.initConfig({
    browserSync: {
      bsFiles: {
        src: [ 'css//*.css',
               'js/*.js',
               '*.html',
               'partials/*.html'
             ]
      },
      options: {
        server: {
          baseDir: './'
        }
      }
    }
  });
 grunt.registerTask('default', ['browserSync']);
};
