angular.module( "vokal.timePicker", [] )

.directive( "timePicker", [ "$compile", "$filter", "$document", "$timeout",

    function ( $compile, $filter, $document, $timeout )
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
            return !!date && angular.isFunction( date.getTime ) && !isNaN( date.getTime() );
        }
        function convertToDate( str )
        {
            return validateDate( str ) ? str : new Date( str );
        }

        return {
            restrict: "A",
            scope: {},
            require: "ngModel",
            link: function ( scope, element, attrs, ngModelController )
            {
                var localDate = new Date( new Date().toDateString() );
                function filterOutput( date )
                {
                    return attrs.pickerType === "string" ?
                        $filter( "date" )( date, attrs.timePicker || defaultFormat ) : date;
                }
                function newModelTime( time )
                {
                    return new Date( localDate.toDateString() + " " + time );
                }

                // Convert data from view to model format and validate
                ngModelController.$parsers.unshift( function( time )
                {
                    var isValidTime = validateTime( time );
                    ngModelController.$setValidity( "time", isValidTime );

                    if( isValidTime )
                    {
                        localDate = newModelTime( time )
                    }

                    return filterOutput( localDate );
                } );

                // Convert data from model to view format and validate
                ngModelController.$formatters.push( function( model )
                {
                    var date = convertToDate( model );
                    var isValidDate = validateDate( date );
                    ngModelController.$setValidity( "time", isValidDate );

                    if( isValidDate )
                    {
                        localDate = angular.copy( date );
                    }

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
                    hidePicker();
                };

                // Build picker template and register with the directive scope
                var template = angular.element(
                    '<ol class="time-picker" data-ng-show="showTimepicker">' +
                    '<li data-ng-repeat="time in times" data-ng-click="applyTime( time )">' +
                    '{{ time }}</li></ol>' );
                $compile( template )( scope );
                element.after( template );

                // Show the picker when clicking in the input
                element.on( "click", showPicker );

                // Hide the picker when typing in the field
                element.on( "keydown paste", hidePicker );
                scope.$on( "$destroy", hidePicker );

                // Hide the picker when clicking away
                var handler = function ( event )
                {
                    if( !template[ 0 ].contains( event.target ) )
                    {
                        scope.$apply( hidePicker );
                    }
                };

                function showPicker()
                {
                    if( !scope.showTimepicker )
                    {
                        scope.showTimepicker = true;
                        $timeout( function ()
                        {
                            $document.on( "click touchstart", handler );
                        }, 100 );
                    }
                }
                function hidePicker()
                {
                    $document.off( "click touchstart", handler );
                    scope.showTimepicker = false;
                }
            }
        };
    }

] );
