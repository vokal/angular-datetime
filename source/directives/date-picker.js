"use strict";

angular.module( "vokal.datePicker", [] )
.directive( "datePicker", [ "$compile", "$filter", "$document", "$timeout",
    function ( $compile, $filter, $document, $timeout )
    {
        var defaultFormat = "M/D/YYYY";
        var hasWarnedTz;

        function validateDate( dateOrString )
        {
            return !!dateOrString && moment( new Date( dateOrString ) ).isValid();
        }
        function warnTz()
        {
            if( !hasWarnedTz )
            {
                console.warn( "Trying to use timezones without including moment-timezone." );
                hasWarnedTz = true;
            }
        }

        return {
            restrict: "A",
            scope: {
                model: "=ngModel",
                timezone: "="
            },
            require: "ngModel",
            link: function ( scope, element, attrs, ngModelController )
            {
                var localMoment = moment();
                updateLocalTimezone();
                if( attrs.timezone && !moment.tz )
                {
                    warnTz();
                }

                function filterForModel()
                {
                    return attrs.pickerType === "string" ? filterForRender( localMoment ) : localMoment.toDate();
                }
                function filterForRender( dateMoment )
                {
                    return dateMoment.format( attrs.datePicker || defaultFormat );
                }

                function setLocalMonthDayYear( month, day, year )
                {
                    localMoment.set( { "month": month, "date": day, "year": year } );
                }
                function setLocalDate( date )
                {
                    localMoment = moment( date );
                    updateLocalTimezone();
                }
                function updateLocalTimezone()
                {
                    if( attrs.timezone && angular.isFunction( localMoment.tz ) )
                    {
                        localMoment.tz( scope.timezone || moment.tz.guess() );
                    }
                }

                if( attrs.timezone )
                {
                    scope.$watch( "timezone", function ( newVal, oldVal )
                    {
                        if( newVal !== oldVal )
                        {
                            updateLocalTimezone();
                            if( !!scope.model )
                            {
                                scope.model = filterForModel();
                            }
                        }
                    } );
                }

                // Convert data from view to model format and validate
                ngModelController.$parsers.unshift( function ( str )
                {
                    var isEmpty = !str;
                    var isValidDate = validateDate( str );
                    ngModelController.$setValidity( "date", isEmpty || isValidDate );

                    if( isValidDate )
                    {
                        var m = moment( new Date( str ) );
                        setLocalMonthDayYear( m.month(), m.date(), m.year() );
                    }

                    return filterForModel();
                } );

                // Convert data from model to view format and validate
                ngModelController.$formatters.push( function ( model )
                {
                    var isEmpty = !model;
                    var isValidDate = validateDate( model );
                    ngModelController.$setValidity( "date", isEmpty || isValidDate );

                    if( isValidDate )
                    {
                        setLocalDate( new Date( model ) );
                        return filterForRender( localMoment );
                    }

                    return model;
                } );

                // Initialize
                var now = moment();
                scope.showDatepicker = false;
                scope.dayNow   = now.date();
                scope.monthNow = now.month();
                scope.yearNow  = now.year();
                scope.dayNames = [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];

                // Build a month of days based on the date passed in
                scope.buildMonth = function ( year, month )
                {
                    var m = moment( { year: year, month: month } );
                    scope.days      = [];
                    scope.filler    = [];
                    scope.year      = year;
                    scope.month     = month;
                    scope.monthName = m.format( "MMMM" );

                    scope.prevYear  = month - 1 < 0  ? year - 1 : year;
                    scope.nextYear  = month + 1 > 11 ? year + 1 : year;
                    scope.prevMonth = month - 1 < 0  ? 11       : month - 1;
                    scope.nextMonth = month + 1 > 11 ? 0        : month + 1;

                    var daysInMonth = m.daysInMonth();
                    var firstDay    = m.day();

                    for( var i = 1; i <= daysInMonth; i++ )
                    {
                        scope.days.push( i );
                    }
                    for( var k = 0; k < firstDay; k++ )
                    {
                        scope.filler.push( k );
                    }
                };

                // Function to put selected date in the scope
                scope.applyDate = function ( month, day, year )
                {
                    setLocalMonthDayYear( month, day, year );
                    scope.model = filterForModel();
                    ngModelController.$setDirty();
                    ngModelController.$setViewValue( filterForRender( localMoment ) );
                    ngModelController.$render();
                    hidePicker();
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
                    'data-ng-repeat="day in days" data-ng-click="applyDate( month, day, year )">' +
                    "{{ day }}</div></div>" );
                $compile( template )( scope );
                element.after( template );

                // Show the picker when clicking in the input
                element.on( "click", function ()
                {
                    if( !scope.showDatepicker )
                    {
                        scope.buildMonth( localMoment.year(), localMoment.month() );

                        scope.showDatepicker = true;
                        $timeout( function ()
                        {
                            $document.on( "click touchstart", handler );
                        }, 100 );
                    }

                } );

                // Hide the picker when typing in the field
                element.on( "keydown paste", hidePicker );
                scope.$on( "$destroy", hidePicker );

                // Hide the picker when clicking away
                var handler = function ( event )
                {
                    if( event.target !== element[ 0 ]
                        && Array.prototype.slice.call( template[ 0 ].children ).indexOf( event.target ) === -1 )
                    {
                        scope.$apply( hidePicker );
                    }
                };
                function hidePicker()
                {
                    $document.off( "click touchstart", handler );
                    $timeout( function ()
                    {
                        scope.showDatepicker = false;
                    }, 25 );
                }
            }
        };
    }

] );
