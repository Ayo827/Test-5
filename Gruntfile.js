module.exports = function(grunt){
    //load plugins
    [
        'grunt-mocha-test',
        'grunt-contrib-jshint',
        'grunt-exec'
    ].forEach(function(task){
        grunt.loadNpmTasks(task);
    });

    //configure plugins
    grunt.initConfig({
           mocha: {
                    all: {src: 'qa/tests-*.js', options: {ui: 'tdd'},}
           },
           jshint: {
               app: ['server.js','lib/**/*.js' ],
               qa: [ 'Gruntfile.js'],
           },
           exec: {
               linkchecker: {
                   cmd: 'linkchecker http://localhost:3000'
               }
           },
    });
    //register tasks
    grunt.registerTask('default', ['mocha', 'jshint', 'exec']);
};