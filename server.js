var express = require( "express" );
var http = require( "http" );
var app = express();

app.use( express.static( __dirname ) );

app.get( "*.*", function ( req, res, next )
{
    res.status( 404 ).send( "Not Found" );
} );

app.get( "*", function ( req, res, next )
{
    res.status( 200 ).sendFile( __dirname + "/test/harness/harness.html" );
} );

var port = process.env.PORT || 3000;
http.createServer( app ).listen( port );
console.log( "Server running on " + port );
