'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;

	var defaultConfig = {
		position: 'left',
		ticks: {
			callback: Chart.Ticks.formatters.linear
		}
	};

	var FinancialLinearScale = Chart.scaleService.getScaleConstructor('linear').extend({

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

			// Regular charts use x, y values
			// For the financial chart we have rawValue.h (hi) and rawValue.l (low) for each point
			helpers.each(datasets, function(dataset, datasetIndex) {
				var meta = chart.getDatasetMeta(datasetIndex);
				if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
					helpers.each(dataset.data, function(rawValue) {
						var high = rawValue.h;
						var low = rawValue.l;

						if (me.min === null) {
							me.min = low;
						} else if (low < me.min) {
							me.min = low;
						}

						if (me.max === null) {
							me.max = high;
						} else if (high > me.max) {
							me.max = high;
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

};
