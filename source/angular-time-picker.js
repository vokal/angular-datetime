angular.module( "vokal.timePicker", [] )

.directive( "timePicker", [ "$compile", "$filter", "$document", "$timeout",

    function ( $compile, $filter, $document, $timeout )
    {
        "use strict";

        var defaultFormat = "h:mm a";
        var defaultDateStr = "1/1/1990" + " ";

        function validateTime( timeStr )
        {
            return !!timeStr && moment( new Date( defaultDateStr + timeStr ) ).isValid();
        }
        function validateDate( dateOrString )
        {
            return !!dateOrString && moment( new Date( dateOrString ) ).isValid();
        }

        return {
            restrict: "A",
            scope: {},
            require: "ngModel",
            link: function ( scope, element, attrs, ngModelController )
            {
                var localMoment = moment();

                function filterForModel()
                {
                    return attrs.pickerType === "string" ?
                        filterForRender( localMoment ) :
                        localMoment.toDate();
                }
                function filterForRender( dateMoment )
                {
                    return dateMoment.format( attrs.timePicker || defaultFormat );
                }

                function newLocalMoment( timeStr )
                {
                    return moment(
                        // Preserve local date
                        new Date( localMoment.toDate().toDateString() + " " + timeStr )
                    );
                }

                // Convert data from view to model format and validate
                ngModelController.$parsers.unshift( function ( str )
                {
                    var isEmpty = !str;
                    var isValidTime = validateTime( str );
                    ngModelController.$setValidity( "time", isEmpty || isValidTime );

                    if( isValidTime )
                    {
                        localMoment = newLocalMoment( str );
                    }

                    return filterForModel();
                } );

                // Convert data from model to view format and validate
                ngModelController.$formatters.push( function ( model )
                {
                    var isEmpty = !model;
                    var isValidDate = validateDate( model );
                    var isValidTime = isValidDate || validateTime( model );

                    ngModelController.$setValidity( "time", isEmpty || isValidDate || isValidTime );

                    if( isValidTime )
                    {
                        localMoment = isValidDate ? moment( new Date( model ) ) : newLocalMoment( model );
                        return filterForRender( localMoment );
                    }

                    return model;
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
                        formattedTime = filterForRender( moment( workingTime ) );
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
                    "{{ time }}</li></ol>" );
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
