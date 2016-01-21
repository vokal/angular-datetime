"use strict";

angular.module( "vokal.datePicker", [] )
.directive( "datePicker", require( "./directives/date-picker" ) );

angular.module( "vokal.timePicker", [] )
.directive( "timePicker", require( "./directives/time-picker" ) );
