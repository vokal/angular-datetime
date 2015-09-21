angular.module( "vokal.datePicker", [] )

.directive( "datePicker", [ "$compile", "$filter",

    function ( $compile, $filter )
    {
        "use strict";

        var defaultFormat = "M/d/yyyy";

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
                        $filter( "date" )( date, attrs.datePicker || defaultFormat ) : date;
                }
                function newModelDate( date )
                {
                    return !scope.date ?
                        filterOutput( date ) :
                        filterOutput( new Date( date.toDateString() + " " + convertToDate( scope.date ).toTimeString() ) );
                }

                // Convert data from view to model format and validate
                ngModelController.$parsers.unshift( function( date )
                {
                    date = new Date( date );
                    var isValidDate = validateDate( date );

                    ngModelController.$setValidity( "date", isValidDate );
                    return isValidDate ? newModelDate( date ) : scope.date;
                } );

                // Convert data from model to view format and validate
                ngModelController.$formatters.push( function( model )
                {
                    var date = convertToDate( model );
                    var isValidDate = validateDate( date );
                    ngModelController.$setValidity( "date", isValidDate );

                    return isValidDate ? $filter( "date" )( date, attrs.datePicker || defaultFormat ) : model;
                } );

                // Initialize
                scope.showDatepicker = false;
                var dateNow    = new Date();
                scope.dayNow   = dateNow.getDate();
                scope.monthNow = dateNow.getMonth() + 1;
                scope.yearNow  = dateNow.getFullYear();
                scope.dayNames = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];

                // Build a month of days based on the date passed in
                scope.buildMonth = function ( year, month )
                {
                    scope.days      = [];
                    scope.filler    = [];
                    scope.year      = year;
                    scope.month     = month;
                    scope.monthName = $filter( "date" )(
                        year + "-" + ( month < 10 ? "0" : "" ) + month + "-01", "MMMM"
                    );

                    scope.prevYear  = month - 1 < 1  ? year - 1 : year;
                    scope.nextYear  = month + 1 > 12 ? year + 1 : year;
                    scope.prevMonth = month - 1 < 1  ? 12       : month - 1;
                    scope.nextMonth = month + 1 > 12 ? 1        : month + 1;

                    var daysInMonth = 32 - new Date( year, month - 1, 32 ).getDate();
                    var firstDay    = new Date( year, month - 1, 1 ).getDay();

                    for( var i = 1; i <= daysInMonth; i++ ) { scope.days.push( i ); }
                    for( var k = 0; k < firstDay; k++ ) { scope.filler.push( k ); }
                };

                // Function to put selected date in the scope
                scope.applyDate = function ( selectedDate )
                {
                    var workingDate   = new Date( selectedDate );
                    var formattedDate = $filter( "date" )( workingDate, attrs.datePicker || defaultFormat );

                    ngModelController.$setViewValue( formattedDate );
                    ngModelController.$render();
                    scope.showDatepicker = false;
                };

                // Build picker template and register with the directive scope
                var template = angular.element(
                    '<div class="date-picker" data-ng-show="showDatepicker">' +
                    '<div class="month-name">{{ monthName }} {{ year }}</div>' +
                    '<div class="month-prev" data-ng-click="buildMonth( prevYear, prevMonth )">&lt;</div>' +
                    '<div class="month-next" data-ng-click="buildMonth( nextYear, nextMonth )">&gt;</div>' +
                    '<div class="day-name-cell" data-ng-repeat="dayName in dayNames">{{ dayName }}</div>' +
                    '<div class="filler-space" data-ng-repeat="space in filler"></div>' +
                    '<div class="date-cell" ' +
                    'data-ng-class="{ today: dayNow == day && monthNow == month && yearNow == year }" ' +
                    'data-ng-repeat="day in days" data-ng-click="applyDate( month + \'/\' + day + \'/\' + year )">' +
                    '{{ day }}</div></div>' );
                $compile( template )( scope );
                element.after( template );

                // Show the picker when clicking in the input
                element.on( "click", function ()
                {
                    scope.$apply( function ()
                    {
                        var startingYear, startingMonth;

                        if( Date.parse( ngModelController.$modelValue ) )
                        {
                            var dateStarting = new Date( ngModelController.$modelValue );
                            startingYear     = dateStarting.getFullYear();
                            startingMonth    = dateStarting.getMonth() + 1;
                        }
                        else
                        {
                            startingYear     = scope.yearNow;
                            startingMonth    = scope.monthNow;
                        }

                        scope.buildMonth( startingYear, startingMonth );

                        scope.showDatepicker = true;
                    } );

                } );

                // Hide the picker when typing in the field
                element.on( "keydown paste", function ()
                {
                    scope.$apply( function ()
                    {
                        scope.showDatepicker = false;
                    } );
                } );

                // Hide the picker when clicking away
                angular.element( document.getElementsByTagName( "html" )[ 0 ] )

                    .on( "mousedown touchstart", function ( event )
                    {
                        if( !scope.showDatepicker )
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
                            scope.showDatepicker = false;
                        } );
                    } );

            }
        };
    }

] );
