"use strict";

global.angular = require( "angular" );
global.moment = require( "moment" );
require( "angular-mocks" );

require( "../../source/index.js" );

angular.module( "Harness", [ "vokal.datePicker", "vokal.timePicker" ] );
