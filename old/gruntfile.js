/*global module, require*/
module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        clean: ['dist'],
        bower: {
            install: {
                options: {
                    targetDir: "dist/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
        buildMetalsmith: {
            debug: {
                options:{
                    includeDrafts: true
                }
            },
            release: {
                options:{
                    includeDrafts: false
                }
            }
        },
        watch: {
            src: {
                files: [
                    'src/**/*',
                    'templates/**/*',
                    'metalsmithBuild.js'
                ],
                tasks: [
                    'buildMetalsmith:debug'
                ]
            },
            bower: {
                files: [
                    'bower.json'
                ],
                tasks: [
                    'bower'
                ]
            },
            grunt:{
                files:[
                    'gruntfile.js'
                ]
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'dist',
                    open: true,
                    hostname: "localhost"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('prep', ['clean', 'bower']);
    grunt.registerTask('default', ['prep', 'buildMetalsmith:release']);
    grunt.registerTask('dev', ['prep', 'buildMetalsmith:debug', 'connect', 'watch']);
    grunt.registerTask('serve', ['prep', 'buildMetalsmith:release', 'connect:server:keepalive']);

    grunt.registerMultiTask('buildMetalsmith', 'Runs metalsmith', function () {
        var done = this.async(),
            metalsmithBuild,
            options = this.options({
                includeDrafts: false
            });
        console.log("Metalsmith build debug mode = " + options.includeDrafts);
        try {
            metalsmithBuild = require('./metalsmithBuild.js');
            metalsmithBuild(options.includeDrafts, done);
        } catch (err) {
            done(err);
        }
    });
};
