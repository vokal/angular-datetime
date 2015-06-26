# angular-datetime

Basic date/time pickers for Angular.js.

> Maintained by @Tathanen

## Configuration & Usage

### Date Picker

Add `dist/angular-date-picker.min.js` and `dist/angular-date-picker.css` to your project, and include `vokal.datePicker` in your module dependencies.

```html
<input type="text" data-ng-model="dateModel" data-date-picker[="M/d/yyyy"]
    [data-picker-type="date"]>
```

#### `date-picker`

By default the picker displays using the `M/d/yyyy` Angular date format.  You can supply a value to change this to any other [supported format](https://docs.angularjs.org/api/ng/filter/date).  Be careful, though, because the format needs to be digestible by the JavaScript `Date` constructor.  If you format your date in a fashion that `Date.parse` doesn't understand, you will have... problems.

#### `picker-type`

By default the picker will expect the model associated with the input field to be of `date` type, and selected values will be stored as `date`s.  You can set this value to `string` instead, to store the string value that appears in the input field directly in the model.

### Time Picker

Add `dist/angular-time-picker.min.js` and `dist/angular-time-picker.css` to your project, and include `vokal.timePicker` in your module dependencies.

```html
<input type="text" data-ng-model="timeModel" data-time-picker[="h:mm a"]
    [data-picker-type="date"]
    [data-picker-interval="60"]>
```

#### `time-picker`

By default the picker displays using the `h:mm a` Angular date format.  You can supply a value to change this to any other [supported format](https://docs.angularjs.org/api/ng/filter/date).  Be careful, though, because the format needs to be digestible by the JavaScript `Date` constructor.  If you format your time in a fashion that `Date.parse` doesn't understand, you will have, yes, problems.

#### `picker-type`

By default the picker will expect the model associated with the input field to be of `date` type, and selected values will be stored as `date`s.  `1/1/1990` will be prepended to the selected time when creating any date objects to keep the parser happy; be sure to export only the time data when you use the model in your application.  You can set this value to `string` instead, to store the string value that appears in the input field directly in the model.

#### `picker-interval`

By default the picker will display times on a 60-minute interval.  This can be changed to any value between `1` and `60` to include more granular times.  Intervals do not wrap around the hour, so a value of `45` will produce a list of times like `2:00`, `2:45`, `3:00`, rather than `2:00`, `2:45`, `3:30`.
