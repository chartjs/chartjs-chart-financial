'use strict';

import Chart from 'chart.js';

const helpers = Chart.helpers;

Chart.defaults.financial = {
	label: '',

	hover: {
		mode: 'label'
	},

	datasets: {
		categoryPercentage: 0.8,
		barPercentage: 0.9,
		animation: {
			numbers: {
				type: 'number',
				properties: ['x', 'y', 'base', 'width', 'height', 'open', 'high', 'low', 'close']
			}
		}
	},

	scales: {
		x: {
			type: 'time',
			distribution: 'series',
			offset: true,
			ticks: {
				major: {
					enabled: true,
				},
				fontStyle: context => context.tick.major ? 'bold' : undefined,
				source: 'data',
				maxRotation: 0,
				autoSkip: true,
				autoSkipPadding: 75,
				sampleSize: 100
			}
		},
		y: {
			type: 'linear'
		}
	},

	tooltips: {
		intersect: false,
		mode: 'index',
		callbacks: {
			label(tooltipItem, data) {
				const dataset = data.datasets[tooltipItem.datasetIndex];
				const point = dataset.data[tooltipItem.index];

				if (!helpers.isNullOrUndef(point.y)) {
					return Chart.defaults.tooltips.callbacks.label(tooltipItem, data);
				}

				const {o, h, l, c} = point;

				return 'O: ' + o + '  H: ' + h + '  L: ' + l + '  C: ' + c;
			}
		}
	}
};

function parseFloatBar(obj, item, vScale, i) {
	const low = vScale.parse(obj.l, i);
	const high = vScale.parse(obj.h, i);
	const min = Math.min(low, high);
	const max = Math.max(low, high);
	let barStart = min;
	let barEnd = max;

	if (Math.abs(min) > Math.abs(max)) {
		barStart = max;
		barEnd = min;
	}

	// Store `barEnd` (furthest away from origin) as parsed value,
	// to make stacking straight forward
	item[vScale.axis] = barEnd;

	item._custom = {
		barStart,
		barEnd,
		min,
		max
	};
}

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
class FinancialController extends Chart.controllers.bar {

	/**
	 * Overriding since we use {o, h, l, c}
	 * @protected
	 */
	parseObjectData(meta, data, start, count) {
		const {iScale, vScale} = meta;
		const parsed = [];
		let i, ilen, item, obj;
		for (i = start, ilen = start + count; i < ilen; ++i) {
			obj = data[i];
			item = {};
			item[iScale.axis] = iScale.parseObject(obj, iScale.axis, i);
			parseFloatBar(obj, item, vScale, i);
			parsed.push(item);
		}
		return parsed;
	}

	/**
	 * Implement this ourselves since it doesn't handle high and low values
	 * https://github.com/chartjs/Chart.js/issues/7328
	 * @protected
	 */
	getMinMax(scale) {
		const meta = this._cachedMeta;
		const _parsed = meta._parsed;

		if (scale.axis === 'x') {
			return {min: _parsed[0].x, max: _parsed[_parsed.length - 1].x};
		}

		let min = Number.POSITIVE_INFINITY;
		let max = Number.NEGATIVE_INFINITY;
		for (let i = 0; i < _parsed.length; i++) {
			const custom = _parsed[i]._custom;
			min = Math.min(min, custom.min);
			max = Math.max(max, custom.max);
		}
		return {min, max};
	}

	/**
	 * @protected
	 */
	calculateElementProperties(index, reset, options) {
		const me = this;
		const vscale = me._getValueScale();
		const base = vscale.getBasePixel();
		const horizontal = vscale.isHorizontal();
		const ruler = me._ruler || me._getRuler();
		const vpixels = me._calculateBarValuePixels(index, options);
		const ipixels = me._calculateBarIndexPixels(index, ruler, options);
		const datasets = me.chart.data.datasets;
		const indexData = datasets[me.index].data[index];

		return {
			horizontal,
			base: reset ? base : vpixels.base,
			x: horizontal ? reset ? base : vpixels.head : ipixels.center,
			y: horizontal ? ipixels.center : reset ? base : vpixels.head,
			height: horizontal ? ipixels.size : undefined,
			width: horizontal ? undefined : ipixels.size,
			open: vscale.getPixelForValue(indexData.o),
			high: vscale.getPixelForValue(indexData.h),
			low: vscale.getPixelForValue(indexData.l),
			close: vscale.getPixelForValue(indexData.c)
		};
	}

}

FinancialController.prototype.dataElementType = Chart.elements.Financial;

export default FinancialController;
