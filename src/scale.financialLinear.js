'use strict';

import Chart from 'chart.js';

var helpers = Chart.helpers;

var defaultConfig = {
	position: 'left',
	ticks: {
		callback: Chart.Ticks.formatters.linear
	}
};

var FinancialLinearScale = Chart.scaleService.getScaleConstructor('linear').extend({

	_parseValue: function(value) {
		var start, end, min, max;

		if (typeof value.c !== 'undefined') {
			start = +this.getRightValue(value.l);
			end = +this.getRightValue(value.h);
			min = Math.min(start, end);
			max = Math.max(start, end);
		} else {
			value = +this.getRightValue(value.y);
			start = undefined;
			end = value;
			min = value;
			max = value;
		}

		return {
			min: min,
			max: max,
			start: start,
			end: end
		};
	},

	determineDataLimits: function() {
		var me = this;
		var chart = me.chart;
		var data = chart.data;
		var datasets = data.datasets;
		var isHorizontal = me.isHorizontal();

		function IDMatches(meta) {
			return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
		}

		// First Calculate the range
		me.min = null;
		me.max = null;

		helpers.each(datasets, function(dataset, datasetIndex) {
			var meta = chart.getDatasetMeta(datasetIndex);
			if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
				helpers.each(dataset.data, function(rawValue, index) {
					var value = me._parseValue(rawValue);

					if (isNaN(value.min) || isNaN(value.max) || meta.data[index].hidden) {
						return;
					}

					if (me.min === null || value.min < me.min) {
						me.min = value.min;
					}

					if (me.max === null || me.max < value.max) {
						me.max = value.max;
					}
				});
			}
		});

		// Add whitespace around bars. Axis shouldn't go exactly from min to max
		var space = (me.max - me.min) * 0.05;
		me.min -= space;
		me.max += space;

		// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
		this.handleTickRangeOptions();
	}
});

Chart.scaleService.registerScaleType('financialLinear', FinancialLinearScale, defaultConfig);

export default FinancialLinearScale;
