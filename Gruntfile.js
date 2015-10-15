module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.initConfig({
    browserSync: {
      bsFiles: {
        src: [ 'public/css//*.css',
               'public/js/*.js',
               '*.html',
               'public/partials/*.html'
             ]
      },
      options: {
        notify: true,
        proxy: "localhost:4000",
      }
    }
  });
 grunt.registerTask('default', ['browserSync']);
};
