"use strict";

var browserifyTransforms = [ [ "babelify", { presets: [ "es2015" ] } ] ];
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
            compile: {
                options: { transform: browserifyTransforms },
                files: {
                    "dist/index.js": [ "source/index.js" ],
                    "dist/angular-date-picker.js": [ "source/date-picker.js" ],
                    "dist/angular-time-picker.js": [ "source/time-picker.js" ]
                }
            },
            test: {
                options: {
                    transform: [
                        [ "browserify-istanbul", {
                            ignore: [
                                "**/node_modules/**",
                                "**/test/**",
                                "**/source/date-picker.js",
                                "**/source/time-picker.js",
                                "**/source/index.js"
                            ]
                        } ]
                    ].concat( browserifyTransforms ),
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
        uglify: {
            compile: {
                files: {
                    "dist/index.min.js": "dist/index.js",
                    "dist/angular-date-picker.min.js": "dist/angular-date-picker.js",
                    "dist/angular-time-picker.min.js": "dist/angular-time-picker.js"
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
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-protractor-coverage" );
    grunt.loadNpmTasks( "grunt-istanbul" );

    grunt.registerTask( "test", [ "clean", "less", "browserify:test", "protractor_coverage", "makeReport" ] );
    grunt.registerTask( "compile", [ "clean", "less", "browserify:compile", "uglify" ] );
};
