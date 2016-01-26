var browserify = require( "browserify" );
var less = require( "less" );
var fs = require( "fs" );

try
{
    fs.mkdirSync( "dist" );
} catch( e )
{
    if( e.code != "EEXIST" )
    {
        throw e;
    }
}

[ {
    src: "source/date-picker.js",
    dest: "dist/angular-date-picker.js"
}, {
    src: "source/time-picker.js",
    dest: "dist/angular-time-picker.js"
}, {
    src: "source/index.js",
    dest: "dist/index.js"
} ].forEach( obj =>
{
    browserify( obj.src, {} )
        .transform( "babelify", { presets: [ "es2015" ] } )
        .bundle()
        .pipe( fs.createWriteStream( obj.dest ) );
} );

[ {
    src: "source/styles/angular-date-picker.less",
    dest: "dist/angular-date-picker.css"
}, {
    src: "source/styles/angular-time-picker.less",
    dest: "dist/angular-time-picker.css"
} ].forEach( obj =>
{
    less.render( fs.readFileSync( obj.src ).toString(), {
        filename: obj.src
    } )
        .then( output =>
        {
            return fs.writeFile( obj.dest, output.css );
        } );
} );
