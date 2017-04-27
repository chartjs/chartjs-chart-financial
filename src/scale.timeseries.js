'use strict';

var moment = require('moment');
moment = typeof (moment) === 'function' ? moment : window.moment;

module.exports = function (Chart) {

    var helpers = Chart.helpers;

	// Default config for a timeseries scale
    var defaultConfig = {
        position: 'bottom',

        time: {
            parser: false, // false == a pattern string from http://momentjs.com/docs/#/parsing/string-format/ or a custom callback that converts its argument to a moment
            format: false, // DEPRECATED false == date objects, moment object, callback or a pattern string from http://momentjs.com/docs/#/parsing/string-format/
            unit: false, // false == automatic or override with week, month, year, etc.
            round: false, // none, or override with week, month, year, etc.
            displayFormat: false, // DEPRECATED
            isoWeekday: false, // override week start day - see http://momentjs.com/docs/#/get-set/iso-weekday/
            minUnit: 'millisecond',

            // defaults to unit's corresponding unitFormat below or override using pattern string from http://momentjs.com/docs/#/displaying/format/
            displayFormats: {
                millisecond: 'h:mm:ss.SSS a', // 11:20:01.123 AM,
                second: 'h:mm:ss a', // 11:20:01 AM
                minute: 'h:mm:ss a', // 11:20:01 AM
                hour: 'MMM D, hA', // Sept 4, 5PM
                day: 'll', // Sep 4 2015
                week: 'll', // Week 46, or maybe "[W]WW - YYYY" ?
                month: 'MMM YYYY', // Sept 2015
                quarter: '[Q]Q - YYYY', // Q3
                year: 'YYYY' // 2015
            },
        },
        ticks: {
            autoSkip: false
        }
    };

    function parseTime(axis, label) {
        var timeOpts = axis.options.time;
        if (typeof timeOpts.parser === 'string') {
            return moment(label, timeOpts.parser);
        }
        if (typeof timeOpts.parser === 'function') {
            return timeOpts.parser(label);
        }
        if (typeof label.getMonth === 'function' || typeof label === 'number') {
            // Date objects
            return moment(label);
        }
        if (label.isValid && label.isValid()) {
            // Moment support
            return label;
        }
        var format = timeOpts.format;
        if (typeof format !== 'string' && format.call) {
            // Custom parsing (return an instance of moment)
            console.warn('options.time.format is deprecated and replaced by options.time.parser.');
            return format(label);
        }
        // Moment format parsing
        return moment(label, format);
    }
    
	var DatasetScale = Chart.Scale.extend({
		/**
		* Internal function to get the correct labels. If data.xLabels or data.yLabels are defined, use those
		* else fall back to data.labels
		* @private
		*/
		getLabels: function() {
			var maxLength = 0;
			helpers.each(this.chart.data.datasets, function(dataset, datasetIndex) {
				if (maxLength === 0) {
					maxLength = dataset.data.length;
				} else if (dataset.data.length > maxLength) {
					maxLength = dataset.data.length;
				}
			});

			var labels = [];
            for (var i = 0; i < maxLength; i++) {
                var labelValue = parseTime(this, this.chart.data.datasets[0].data[i].t).format(this.options.time.format);
                labels.push(labelValue);
			}

			return labels;
		},

		determineDataLimits: function() {
            var me = this;

            var timeOpts = me.options.time;

			var labels = me.getLabels();
			me.minIndex = 0;
			me.maxIndex = labels.length - 1;
			var findIndex;

			if (me.options.ticks.min !== undefined) {
				// user specified min value
				findIndex = helpers.indexOf(labels, me.options.ticks.min);
				me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
			}

			if (me.options.ticks.max !== undefined) {
				// user specified max value
				findIndex = helpers.indexOf(labels, me.options.ticks.max);
				me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
			}

			me.min = labels[me.minIndex];
			me.max = labels[me.maxIndex];
		},

		buildTicks: function() {
			var me = this;
			var labels = me.getLabels();
			// If we are viewing some subset of labels, slice the original array
			me.ticks = (me.minIndex === 0 && me.maxIndex === labels.length - 1) ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
		},

		getLabelForIndex: function(index, datasetIndex) {
			var me = this;
			var data = me.chart.data;
			var isHorizontal = me.isHorizontal();

			if (data.yLabels && !isHorizontal) {
				return me.getRightValue(data.datasets[datasetIndex].data[index]);
			}
			return me.ticks[index - me.minIndex];
		},

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: function(value, index, datasetIndex, includeOffset) {
			var me = this;
			// 1 is added because we need the length but we have the indexes
			var offsetAmt = Math.max((me.maxIndex + 1 - me.minIndex - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);

			// If value is a data object, then index is the index in the data array,
			// not the index of the scale. We need to change that.
			var valueCategory;
			if (value !== undefined && value !== null) {
				valueCategory = me.isHorizontal() ? value.x : value.y;
			}
			if (valueCategory !== undefined || (value !== undefined && isNaN(index))) {
				var labels = me.getLabels();
				value = valueCategory || value;
				var idx = labels.indexOf(value);
				index = idx !== -1 ? idx : index;
			}

			if (me.isHorizontal()) {
				var valueWidth = me.width / offsetAmt;
				var widthOffset = (valueWidth * (index - me.minIndex));

				if (me.options.gridLines.offsetGridLines && includeOffset || me.maxIndex === me.minIndex && includeOffset) {
					widthOffset += (valueWidth / 2);
				}

				return me.left + Math.round(widthOffset);
			}
			var valueHeight = me.height / offsetAmt;
			var heightOffset = (valueHeight * (index - me.minIndex));

			if (me.options.gridLines.offsetGridLines && includeOffset) {
				heightOffset += (valueHeight / 2);
			}

			return me.top + Math.round(heightOffset);
		},
		getPixelForTick: function(index, includeOffset) {
			return this.getPixelForValue(this.ticks[index], index + this.minIndex, null, includeOffset);
		},
		getValueForPixel: function(pixel) {
			var me = this;
			var value;
			var offsetAmt = Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
			var horz = me.isHorizontal();
			var valueDimension = (horz ? me.width : me.height) / offsetAmt;

			pixel -= horz ? me.left : me.top;

			if (me.options.gridLines.offsetGridLines) {
				pixel -= (valueDimension / 2);
			}

			if (pixel <= 0) {
				value = 0;
			} else {
				value = Math.round(pixel / valueDimension);
			}

			return value;
		},
		getBasePixel: function() {
			return this.bottom;
		}
	});

	Chart.scaleService.registerScaleType('timeseries', DatasetScale, defaultConfig);

};
