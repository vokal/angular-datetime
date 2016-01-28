var babel = require( "babel-core" );
var less = require( "less" );
var fs = require( "fs" );

fs.mkdir( "dist", err => {
    if( err && err.code != "EEXIST" )
    {
        throw err;
    }
    fs.mkdir( "dist/directives", e => {
        if( e && e.code != "EEXIST" )
        {
            throw e;
        }
    } );
} );

[
    "index.js",
    "directives/date-picker.js",
    "directives/time-picker.js"
].forEach( file =>
{
    babel.transformFile( "source/" + file, {
        presets: [ "es2015" ]
    }, ( err, result ) => fs.writeFile( "dist/" + file, result.code ) );
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
        .then( output => fs.writeFile( obj.dest, output.css ) );
} );
