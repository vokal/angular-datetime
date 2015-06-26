angular.module( "vokal.timePicker", [] )

.directive( "timePicker", [ "$compile", "$filter",

    function ( $compile, $filter )
    {
        "use strict";

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

                    return attrs.pickerType === "string" ?
                        $filter( "date" )( timeData, attrs.timePicker || "h:mm a" ) : timeData;
                } );

                // Convert data from model to view format and validate
                ngModelController.$formatters.push( function( data )
                {
                    var validTime, timeData = data;

                    if( timeData )
                    {
                        if( typeof timeData.getTime !== "function" )
                        {
                            timeData = new Date( "1/1/1990 " + timeData );
                        }

                        validTime = !isNaN( timeData.getTime() );

                        ngModelController.$setValidity( "time", validTime );
                    }

                    return validTime ? $filter( "date" )( timeData, attrs.timePicker || "h:mm a" ) : data;
                } );

                // Initialize
                scope.times = [];
                scope.showTimepicker = false;
                var interval = attrs.pickerInterval ? parseInt( attrs.pickerInterval, 10 ) : 60;
                var workingTime, minute, formattedTime;

                // Build array of time objects by interval
                for( var i = 0; i < 24; i++ )
                {
                    for( var k = 0; k < 60; k += interval )
                    {
                        minute        = k < 10 ? "0" + k : k;
                        workingTime   = new Date( "1/1/1990 " + i + ":" + minute );
                        formattedTime = $filter( "date" )( workingTime, attrs.timePicker || "h:mm a" );
                        scope.times.push( formattedTime );
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
                    '<ol class="time-picker" data-ng-show="showTimepicker">' +
                    '<li data-ng-repeat="time in times" data-ng-click="applyTime( time )">' +
                    '{{ time }}</li></ol>' );
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
