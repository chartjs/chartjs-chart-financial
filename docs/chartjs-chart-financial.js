/*!
 * @license
 * chartjs-chart-financial
 * http://chartjs.org/
 * Version: 0.1.0
 *
 * Copyright 2020 Chart.js Contributors
 * Released under the MIT license
 * https://github.com/chartjs/chartjs-chart-financial/blob/master/LICENSE.md
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
(global = global || self, factory(global.Chart));
}(this, (function (Chart) { 'use strict';

Chart = Chart && Object.prototype.hasOwnProperty.call(Chart, 'default') ? Chart['default'] : Chart;

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

const helpers$1 = Chart.helpers;
const globalOpts = Chart.defaults;

globalOpts.elements.financial = {
	color: {
		up: 'rgba(80, 160, 115, 1)',
		down: 'rgba(215, 85, 65, 1)',
		unchanged: 'rgba(90, 90, 90, 1)',
	}
};

/**
 * Helper function to get the bounds of the bar regardless of the orientation
 * @param {Rectangle} bar the bar
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the bar
 * @private
 */
function getBarBounds(bar, useFinalPosition) {
	const {x, y, base, width, height} = bar.getProps(['x', 'low', 'high', 'width', 'height'], useFinalPosition);

	let left, right, top, bottom, half;

	if (bar.horizontal) {
		half = height / 2;
		left = Math.min(x, base);
		right = Math.max(x, base);
		top = y - half;
		bottom = y + half;
	} else {
		half = width / 2;
		left = x - half;
		right = x + half;
		top = Math.min(y, base);
		bottom = Math.max(y, base);
	}

	return {left, top, right, bottom};
}

function inRange(bar, x, y, useFinalPosition) {
	const skipX = x === null;
	const skipY = y === null;
	const bounds = !bar || (skipX && skipY) ? false : getBarBounds(bar, useFinalPosition);

	return bounds
		&& (skipX || x >= bounds.left && x <= bounds.right)
		&& (skipY || y >= bounds.top && y <= bounds.bottom);
}

class FinancialElement extends Chart.Element {

	height() {
		return this.base - this.y;
	}

	inRange(mouseX, mouseY, useFinalPosition) {
		return inRange(this, mouseX, mouseY, useFinalPosition);
	}

	inXRange(mouseX, useFinalPosition) {
		return inRange(this, mouseX, null, useFinalPosition);
	}

	inYRange(mouseY, useFinalPosition) {
		return inRange(this, null, mouseY, useFinalPosition);
	}

	getRange(axis) {
		return axis === 'x' ? this.width / 2 : this.height / 2;
	}

	getCenterPoint(useFinalPosition) {
		const {x, low, high} = this.getProps(['x', 'low', 'high'], useFinalPosition);
		return {
			x,
			y: (high + low) / 2
		};
	}

	tooltipPosition(useFinalPosition) {
		const {x, open, close} = this.getProps(['x', 'open', 'close'], useFinalPosition);
		return {
			x,
			y: (open + close) / 2
		};
	}
}

const helpers$2 = Chart.helpers;
const globalOpts$1 = Chart.defaults;

globalOpts$1.elements.candlestick = helpers$2.merge({}, [globalOpts$1.elements.financial, {
	borderColor: globalOpts$1.elements.financial.color.unchanged,
	borderWidth: 1,
}]);

class CandlestickElement extends FinancialElement {
	draw(ctx) {
		const me = this;

		const {x, open, high, low, close} = me;

		let borderColors = me.borderColor;
		if (typeof borderColors === 'string') {
			borderColors = {
				up: borderColors,
				down: borderColors,
				unchanged: borderColors
			};
		}

		let borderColor;
		if (close < open) {
			borderColor = helpers$2.valueOrDefault(borderColors ? borderColors.up : undefined, globalOpts$1.elements.candlestick.borderColor);
			ctx.fillStyle = helpers$2.valueOrDefault(me.color ? me.color.up : undefined, globalOpts$1.elements.candlestick.color.up);
		} else if (close > open) {
			borderColor = helpers$2.valueOrDefault(borderColors ? borderColors.down : undefined, globalOpts$1.elements.candlestick.borderColor);
			ctx.fillStyle = helpers$2.valueOrDefault(me.color ? me.color.down : undefined, globalOpts$1.elements.candlestick.color.down);
		} else {
			borderColor = helpers$2.valueOrDefault(borderColors ? borderColors.unchanged : undefined, globalOpts$1.elements.candlestick.borderColor);
			ctx.fillStyle = helpers$2.valueOrDefault(me.color ? me.color.unchanged : undefined, globalOpts$1.elements.candlestick.color.unchanged);
		}

		ctx.lineWidth = helpers$2.valueOrDefault(me.borderWidth, globalOpts$1.elements.candlestick.borderWidth);
		ctx.strokeStyle = helpers$2.valueOrDefault(borderColor, globalOpts$1.elements.candlestick.borderColor);

		ctx.beginPath();
		ctx.moveTo(x, high);
		ctx.lineTo(x, Math.min(open, close));
		ctx.moveTo(x, low);
		ctx.lineTo(x, Math.max(open, close));
		ctx.stroke();
		ctx.fillRect(x - me.width / 2, close, me.width, open - close);
		ctx.strokeRect(x - me.width / 2, close, me.width, open - close);
		ctx.closePath();
	}
}

Chart.defaults.candlestick = Chart.helpers.merge({}, Chart.defaults.financial);

class CandlestickController extends FinancialController {

	updateElements(elements, start, mode) {
		for (let i = 0; i < elements.length; i++) {
			const me = this;
			const dataset = me.getDataset();
			const index = start + i;
			const options = me.resolveDataElementOptions(index, mode);

			const baseProperties = me.calculateElementProperties(index, mode === 'reset', options);
			const properties = {
				...baseProperties,
				datasetLabel: dataset.label || '',
				// label: '', // to get label value please use dataset.data[index].label

				// Appearance
				color: dataset.color,
				borderColor: dataset.borderColor,
				borderWidth: dataset.borderWidth,
			};
			properties.options = options;

			me.updateElement(elements[i], index, properties, mode);
		}
	}

}

CandlestickController.prototype.dataElementType = CandlestickElement;
Chart.controllers.candlestick = CandlestickController;

const helpers$3 = Chart.helpers;
const globalOpts$2 = Chart.defaults;

globalOpts$2.elements.ohlc = helpers$3.merge({}, [globalOpts$2.elements.financial, {
	lineWidth: 2,
	armLength: null,
	armLengthRatio: 0.8,
}]);

class OhlcElement extends FinancialElement {
	draw(ctx) {
		const me = this;

		const {x, open, high, low, close} = me;

		const armLengthRatio = helpers$3.valueOrDefault(me.armLengthRatio, globalOpts$2.elements.ohlc.armLengthRatio);
		let armLength = helpers$3.valueOrDefault(me.armLength, globalOpts$2.elements.ohlc.armLength);
		if (armLength === null) {
			// The width of an ohlc is affected by barPercentage and categoryPercentage
			// This behavior is caused by extending controller.financial, which extends controller.bar
			// barPercentage and categoryPercentage are now set to 1.0 (see controller.ohlc)
			// and armLengthRatio is multipled by 0.5,
			// so that when armLengthRatio=1.0, the arms from neighbour ohcl touch,
			// and when armLengthRatio=0.0, ohcl are just vertical lines.
			armLength = me.width * armLengthRatio * 0.5;
		}

		if (close < open) {
			ctx.strokeStyle = helpers$3.valueOrDefault(me.color ? me.color.up : undefined, globalOpts$2.elements.ohlc.color.up);
		} else if (close > open) {
			ctx.strokeStyle = helpers$3.valueOrDefault(me.color ? me.color.down : undefined, globalOpts$2.elements.ohlc.color.down);
		} else {
			ctx.strokeStyle = helpers$3.valueOrDefault(me.color ? me.color.unchanged : undefined, globalOpts$2.elements.ohlc.color.unchanged);
		}
		ctx.lineWidth = helpers$3.valueOrDefault(me.lineWidth, globalOpts$2.elements.ohlc.lineWidth);

		ctx.beginPath();
		ctx.moveTo(x, high);
		ctx.lineTo(x, low);
		ctx.moveTo(x - armLength, open);
		ctx.lineTo(x, open);
		ctx.moveTo(x + armLength, close);
		ctx.lineTo(x, close);
		ctx.stroke();
	}
}

Chart.defaults.ohlc = Chart.helpers.merge({}, Chart.defaults.financial);
Chart.defaults.set('ohlc', {
	datasets: {
		barPercentage: 1.0,
		categoryPercentage: 1.0
	}
});

class OhlcController extends FinancialController {

	updateElements(elements, start, mode) {
		for (let i = 0; i < elements.length; i++) {
			const me = this;
			const dataset = me.getDataset();
			const index = start + i;
			const options = me.resolveDataElementOptions(index, mode);

			const baseProperties = me.calculateElementProperties(index, mode === 'reset', options);
			const properties = {
				...baseProperties,
				datasetLabel: dataset.label || '',
				lineWidth: dataset.lineWidth,
				armLength: dataset.armLength,
				armLengthRatio: dataset.armLengthRatio,
				color: dataset.color,
			};
			properties.options = options;

			me.updateElement(elements[i], index, properties, mode);
		}
	}

}

OhlcController.prototype.dataElementType = OhlcElement;
Chart.controllers.ohlc = OhlcController;

})));
