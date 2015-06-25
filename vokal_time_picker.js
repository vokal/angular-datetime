angular.module( "vokal.timePicker", [] )

.directive( "timePicker", [ "$compile", "$filter",

    function ( $compile, $filter )
    {
        "use strict";

        // Usage: <input type="text" x-ng-model="modelName" x-time-picker
        //                           x-time-picker-options='{ "interval": 30 }'>

        return {
            restrict: "A",
            scope: {},
            require: "ngModel",
            link: function ( scope, element, attrs, ngModelController )
            {
                // Convert data from view to model format and validate
                ngModelController.$parsers.unshift( function( data )
                {
                    var timeData = new Date( "1/1/1990 " + data );

                    ngModelController.$setValidity( "time", !isNaN( timeData.getTime() ) );

                    return timeData;
                } );

                // Convert data from model to view format and validate
                ngModelController.$formatters.push( function( data )
                {
                    if( data )
                    {
                        ngModelController.$setValidity( "time", data.getTime && !isNaN( data.getTime() ) );
                    }

                    return data ? $filter( "date" )( data, "shortTime" ) : "";
                } );

                // Initialize
                scope.times = [];
                scope.showTimepicker = false;
                var options  = attrs.timePickerOptions ? JSON.parse( attrs.timePickerOptions ) : {};
                var interval = options.interval || 60;
                var hour, minute, apm;

                // Build array of time objects by interval
                for( var i = 0; i < 24; i++ )
                {
                    for( var k = 0; k < 60; k += interval )
                    {
                        hour   = i > 12 ? i - 12 : i;
                        hour   = hour === 0 ? hour + 12 : hour;
                        minute = k < 10 ? "0" + k : k;
                        apm    = i > 11 ? "PM" : "AM";
                        scope.times.push( { display: hour + ":" + minute + " " + apm, value: i + ":" + minute } );
                    }
                }

                // Function to put selected time in the scope
                scope.applyTime = function ( selectedTime )
                {
                    ngModelController.$setViewValue( selectedTime );
                    ngModelController.$render();
                    scope.showTimepicker = false;
                };

                // Build picker template and register with the directive scope
                var template = angular.element(
                    '<div class="time-picker" x-ng-show="showTimepicker">' +
                    '<div x-ng-repeat="time in times" x-ng-click="applyTime( time.display )">' +
                    '{{ time.display }}</div></div>' );
                $compile( template )( scope );
                element.after( template );

                // Show the picker when clicking in the input
                element.on( "click", function ()
                {
                    scope.$apply( function ()
                    {
                        scope.showTimepicker = true;
                    } );
                } );

                // Hide the picker when typing in the field
                element.on( "keydown paste", function ()
                {
                    scope.$apply( function ()
                    {
                        scope.showTimepicker = false;
                    } );
                } );

                // Hide the picker when clicking away
                angular.element( document.getElementsByTagName( "html" )[ 0 ] )
                .on( "mousedown touchstart", function ( event )
                {
                    if( !scope.showTimepicker )
                    {
                        return;
                    }

                    for( var focusScope = angular.element( event.target ).scope();
                            focusScope; focusScope = focusScope.$parent )
                    {
                        if ( scope.$id === focusScope.$id )
                        {
                            return;
                        }
                    }

                    scope.$apply( function ()
                    {
                        scope.showTimepicker = false;
                    } );
                } );

            }
        };
    }

] );