module.exports = function (grunt) {

    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // task configuration will be written here.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // execute shell commands
        shell: {
            options: {
                stdout: true
            }
        },
        // validate files with JSHint.
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                force: true,
                esversion: 6,
                '-W138': true   // for defaults parameters [function foo(a = 1)]
            },
            all: ['src/*']
        }
    });

    // register all tasks.
    grunt.registerTask('lint', ['jshint']);
};
