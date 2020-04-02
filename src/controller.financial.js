'use strict';

import Chart from 'chart.js';

const helpers = Chart.helpers;

Chart.defaults.financial = {
	label: '',

	hover: {
		mode: 'label'
	},

	scales: {
		xAxes: [{
			type: 'time',
			distribution: 'series',
			offset: true,
			ticks: {
				major: {
					enabled: true,
					fontStyle: 'bold'
				},
				source: 'data',
				maxRotation: 0,
				autoSkip: true,
				autoSkipPadding: 75,
				sampleSize: 100
			}
		}],
		yAxes: [{
			type: 'financialLinear'
		}]
	},

	tooltips: {
		intersect: false,
		mode: 'index',
		callbacks: {
			label(tooltipItem, data) {
				const dataset = data.datasets[tooltipItem.datasetIndex];
				const point = dataset.data[tooltipItem.index];

				if (!helpers.isNullOrUndef(point.y)) {
					return Chart.defaults.global.tooltips.callbacks.label(tooltipItem, data);
				}

				const o = point.o;
				const h = point.h;
				const l = point.l;
				const c = point.c;

				return 'O: ' + o + '  H: ' + h + '  L: ' + l + '  C: ' + c;
			}
		}
	}
};

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
const FinancialController = Chart.controllers.bar.extend({

	dataElementType: Chart.elements.Financial,

	/**
	 * @private
	 */
	_updateElementGeometry(element, index, reset, options) {
		const me = this;
		const model = element._model;
		const vscale = me._getValueScale();
		const base = vscale.getBasePixel();
		const horizontal = vscale.isHorizontal();
		const ruler = me._ruler || me.getRuler();
		const vpixels = me.calculateBarValuePixels(me.index, index, options);
		const ipixels = me.calculateBarIndexPixels(me.index, index, ruler, options);
		const chart = me.chart;
		const datasets = chart.data.datasets;
		const indexData = datasets[me.index].data[index];

		model.horizontal = horizontal;
		model.base = reset ? base : vpixels.base;
		model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
		model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
		model.height = horizontal ? ipixels.size : undefined;
		model.width = horizontal ? undefined : ipixels.size;
		model.candleOpen = vscale.getPixelForValue(Number(indexData.o));
		model.candleHigh = vscale.getPixelForValue(Number(indexData.h));
		model.candleLow = vscale.getPixelForValue(Number(indexData.l));
		model.candleClose = vscale.getPixelForValue(Number(indexData.c));
	},

	draw() {
		const ctx = this.chart.chart.ctx;
		const elements = this.getMeta().data;
		const dataset = this.getDataset();
		const ilen = elements.length;
		let i = 0;
		let d;

		Chart.canvasHelpers.clipArea(ctx, this.chart.chartArea);

		for (; i < ilen; ++i) {
			d = dataset.data[i].o;
			if (d !== null && d !== undefined && !isNaN(d)) {
				elements[i].draw();
			}
		}

		Chart.canvasHelpers.unclipArea(ctx);
	}
});

export default FinancialController;
