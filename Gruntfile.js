module.exports = function( grunt )
{
    "use strict";

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
                    "dist/angular-date-picker.min.js": "source/angular-date-picker.js",
                    "dist/angular-time-picker.min.js": "source/angular-time-picker.js"
                }
            }
        }

    } );

    // Load plugins
    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );

};
