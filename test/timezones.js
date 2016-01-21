"use strict";

var harnessUrl = "/test/harness/harness-tz.html";

describe( "Date Picker", function ()
{
    it( "should load", function ()
    {
        browser.get( harnessUrl );
    } );

    it( "should run this test", function ()
    {
        expect( 7 + 8 ).toBe( 15 );
    } );

} );
