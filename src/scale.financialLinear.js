'use strict';

import Chart from 'chart.js';

const helpers = Chart.helpers;

const defaultConfig = {
	position: 'left',
	ticks: {
		callback: Chart.Ticks.formatters.linear
	}
};

const FinancialLinearScale = Chart.scaleService.getScaleConstructor('linear').extend({

	_parseValue(value) {
		let start, end, min, max;

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
			min,
			max,
			start,
			end
		};
	},

	determineDataLimits() {
		const me = this;
		const chart = me.chart;
		const data = chart.data;
		const datasets = data.datasets;
		const isHorizontal = me.isHorizontal();

		function IDMatches(meta) {
			return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
		}

		// First Calculate the range
		me.min = null;
		me.max = null;

		helpers.each(datasets, (dataset, datasetIndex) => {
			const meta = chart.getDatasetMeta(datasetIndex);
			if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
				helpers.each(dataset.data, (rawValue, index) => {
					const value = me._parseValue(rawValue);

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
		const space = (me.max - me.min) * 0.05;
		me.min -= space;
		me.max += space;

		// Common base implementation to handle ticks.min, ticks.max, ticks.beginAtZero
		this.handleTickRangeOptions();
	}
});

Chart.scaleService.registerScaleType('financialLinear', FinancialLinearScale, defaultConfig);

export default FinancialLinearScale;
