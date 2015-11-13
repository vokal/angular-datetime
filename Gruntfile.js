"use strict";

module.exports = function ( grunt )
{
    grunt.initConfig( {

        pkg: grunt.file.readJSON( "package.json" ),

        less:
        {
            all:
            {
                files: {
                    "dist/angular-date-picker.css": "source/angular-date-picker.less",
                    "dist/angular-time-picker.css": "source/angular-time-picker.less"
                }
            }
        },

        umd: {
            date: {
                options: {
                    src: "source/angular-date-picker.js",
                    dest: "dist/angular-date-picker.js",
                    amdModuleId: "angular-date-picker"
                }
            },
            time: {
                options: {
                    src: "source/angular-time-picker.js",
                    dest: "dist/angular-time-picker.js",
                    amdModuleId: "angular-time-picker"
                }
            }
        },

        uglify:
        {
            options:
            {
                mangle: true,
                compress: true,
                banner: "/*! <%= pkg.name %> Copyright Vokal <%= grunt.template.today( 'yyyy' ) %> */\n",
                sourceMap: false
            },
            all:
            {
                files:
                {
                    "dist/angular-date-picker.min.js": "dist/angular-date-picker.js",
                    "dist/angular-time-picker.min.js": "dist/angular-time-picker.js"
                }
            }
        },

        copy: {
            dist: {
                src: "source/index.js",
                dest: "dist/index.js"
            }
        }

    } );

    // Load plugins
    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-copy" );
    grunt.loadNpmTasks( "grunt-umd" );

    grunt.registerTask( "dist", [ "less", "umd", "copy", "uglify" ] );

};
