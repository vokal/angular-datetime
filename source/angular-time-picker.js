angular.module( "vokal.timePicker", [] )

.directive( "timePicker", [ "$compile", "$filter",

    function ( $compile, $filter )
    {
        "use strict";

        var defaultFormat = "h:mm a";
        var defaultDateStr = "1/1/1990" + " ";

        function validateTime( time )
        {
            return !!time && angular.isString( time ) && !isNaN( new Date( defaultDateStr + time ).getTime() );
        }
        function validateDate( date )
        {
            return date && angular.isFunction( date.getTime ) && !isNaN( date.getTime() );
        }
        function convertToDate( str )
        {
            return validateDate( str ) ? str : new Date( str );
        }

        return {
            restrict: "A",
            scope: {
                date: "=ngModel"
            },
            require: "ngModel",
            link: function ( scope, element, attrs, ngModelController )
            {
                function filterOutput( date )
                {
                    return attrs.pickerType === "string" ?
                        $filter( "date" )( date, attrs.timePicker || defaultFormat ) : date;
                }
                function newModelDate( time )
                {
                    if( !time )
                    {
                        return scope.date;
                    }

                    return !scope.date ?
                        filterOutput( new Date( defaultDateStr + time ) ) :
                        filterOutput( new Date( convertToDate( scope.date ).toDateString() + " " + time ) );
                }

                // Convert data from view to model format and validate
                ngModelController.$parsers.unshift( function( time )
                {
                    var isValidTime = validateTime( time );
                    ngModelController.$setValidity( "time", isValidTime );

                    return isValidTime ? newModelDate( time ) : scope.date;
                } );

                // Convert data from model to view format and validate
                ngModelController.$formatters.push( function( model )
                {
                    var date = convertToDate( model );
                    var isValidDate = validateDate( date );
                    ngModelController.$setValidity( "time", isValidDate );

                    return isValidDate ? $filter( "date" )( date, attrs.timePicker || defaultFormat ) : model;
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
                        workingTime   = new Date( defaultDateStr + i + ":" + minute );
                        formattedTime = $filter( "date" )( workingTime, attrs.timePicker || defaultFormat );
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
                            if( scope.$id === focusScope.$id )
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
