// Attach a date picker to a text input field
angular.module( "vokal.datePicker", [] )

.directive( "datePicker", [ "$compile", "$filter",

    function ( $compile, $filter )
    {
        "use strict";

        // Usage: <input type="text" x-ng-model="modelName" x-datepicker="modelName">

        return {
            restrict: "A",
            scope: { dateValue: "=datePicker" },
            require: "ngModel",
            link: function ( scope, element, attrs, ngModelController )
            {
                // Convert data from view to model format and validate
                ngModelController.$parsers.unshift( function( data )
                {
                    var dateData = new Date( data );

                    ngModelController.$setValidity( "date", !isNaN( dateData.getTime() ) );

                    return dateData;
                } );

                // Convert data from model to view format and validate
                ngModelController.$formatters.push( function( data )
                {
                    if( data )
                    {
                        ngModelController.$setValidity( "date", data.getTime && !isNaN( data.getTime() ) );
                    }

                    return data ? $filter( "date" )( data, "M/d/yyyy" ) : "";
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
                    scope.dateValue = new Date( selectedDate );
                    scope.showDatepicker = false;
                };

                // Build picker template and register with the directive scope
                var template = angular.element(
                    '<div class="date-picker" x-ng-show="showDatepicker">' +
                    '<div class="month-name">{{ monthName }} {{ year }}</div>' +
                    '<div class="month-prev" x-ng-click="buildMonth( prevYear, prevMonth )">&lt;</div>' +
                    '<div class="month-next" x-ng-click="buildMonth( nextYear, nextMonth )">&gt;</div>' +
                    '<div class="day-name-cell" x-ng-repeat="dayName in dayNames">{{ dayName }}</div>' +
                    '<div class="filler-space" x-ng-repeat="space in filler"></div>' +
                    '<div class="date-cell" ' +
                    'x-ng-class="{ today: dayNow == day && monthNow == month && yearNow == year }" ' +
                    'x-ng-repeat="day in days" x-ng-click="applyDate( month + \'/\' + day + \'/\' + year )">' +
                    '{{ day }}</div></div>' );
                $compile( template )( scope );
                element.after( template );

                // Show the picker when clicking in the input
                element.on( "click", function ()
                {
                    scope.$apply( function ()
                    {
                        var startingYear, startingMonth;

                        if( Date.parse( scope.dateValue ) )
                        {
                            var dateStarting = new Date( scope.dateValue );
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
                        if ( scope.$id === focusScope.$id )
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