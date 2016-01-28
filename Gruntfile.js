"use strict";

module.exports = function ( grunt )
{
    grunt.initConfig( {
        clean: {
            build: [ "build/" ],
            coverage: [ "coverage/" ],
            dist: [ "dist/" ]
        },
        less: {
            all: {
                files: {
                    "dist/angular-date-picker.css": "source/styles/angular-date-picker.less",
                    "dist/angular-time-picker.css": "source/styles/angular-time-picker.less"
                }
            }
        },
        browserify: {
            test: {
                options: {
                    transform: [
                        [ "browserify-istanbul", {
                            ignore: [
                                "**/node_modules/**",
                                "**/test/**",
                                "**/source/index.js"
                            ]
                        } ],
                        [ "babelify", { presets: [ "es2015" ] } ]
                    ],
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    "build/test.js": [ "test/harness/index.js" ],
                    "build/test-tz.js": [ "test/harness/index-tz.js" ]
                }
            }
        },
        protractor_coverage: {
            options: {
                keepAlive: false,
                noColor: false,
                coverageDir: "coverage/protractor",
                args: {
                    baseUrl: "http://localhost:3000"
                }
            },
            test: {
                options: {
                    configFile: "test/config/protractor.js"
                }
            }
        },
        makeReport: {
            src: "coverage/**/*.json",
            options: {
                type: [ "lcov", "html" ],
                dir: "coverage/net",
                print: "detail"
            }
        }
    } );

    // Load plugins
    grunt.loadNpmTasks( "grunt-browserify" );
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "grunt-protractor-coverage" );
    grunt.loadNpmTasks( "grunt-istanbul" );

    grunt.registerTask( "test", [ "clean", "less", "browserify:test", "protractor_coverage", "makeReport" ] );
};
