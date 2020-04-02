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

const helpers$1 = Chart.helpers;

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

				if (!helpers$1.isNullOrUndef(point.y)) {
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

const helpers$2 = Chart.helpers;
const globalOpts = Chart.defaults.global;

globalOpts.elements.financial = {
	color: {
		up: 'rgba(80, 160, 115, 1)',
		down: 'rgba(215, 85, 65, 1)',
		unchanged: 'rgba(90, 90, 90, 1)',
	}
};

function isVertical(bar) {
	return bar._view.width !== undefined;
}

/**
 * Helper function to get the bounds of the candle
 * @private
 * @param bar {Chart.Element.financial} the bar
 * @return {Bounds} bounds of the bar
 */
function getBarBounds(candle) {
	const vm = candle._view;

	const halfWidth = vm.width / 2;
	const x1 = vm.x - halfWidth;
	const x2 = vm.x + halfWidth;
	const y1 = vm.candleHigh;
	const y2 = vm.candleLow;

	return {
		left: x1,
		top: y1,
		right: x2,
		bottom: y2
	};
}

const FinancialElement = Chart.Element.extend({

	height() {
		const vm = this._view;
		return vm.base - vm.y;
	},
	inRange(mouseX, mouseY) {
		let inRange = false;

		if (this._view) {
			const bounds = getBarBounds(this);
			inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
		}

		return inRange;
	},
	inLabelRange(mouseX, mouseY) {
		const me = this;
		if (!me._view) {
			return false;
		}

		let inRange = false;
		const bounds = getBarBounds(me);

		if (isVertical(me)) {
			inRange = mouseX >= bounds.left && mouseX <= bounds.right;
		} else {
			inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
		}

		return inRange;
	},
	inXRange(mouseX) {
		const bounds = getBarBounds(this);
		return mouseX >= bounds.left && mouseX <= bounds.right;
	},
	inYRange(mouseY) {
		const bounds = getBarBounds(this);
		return mouseY >= bounds.top && mouseY <= bounds.bottom;
	},
	getCenterPoint() {
		const vm = this._view;
		return {
			x: vm.x,
			y: (vm.candleHigh + vm.candleLow) / 2
		};
	},
	getArea() {
		const vm = this._view;
		return vm.width * Math.abs(vm.y - vm.base);
	},
	tooltipPosition() {
		const vm = this._view;
		return {
			x: vm.x,
			y: (vm.candleOpen + vm.candleClose) / 2
		};
	},
	hasValue() {
		const model = this._model;
		return helpers$2.isNumber(model.x) &&
			helpers$2.isNumber(model.candleOpen) &&
			helpers$2.isNumber(model.candleHigh) &&
			helpers$2.isNumber(model.candleLow) &&
			helpers$2.isNumber(model.candleClose);
	}
});

const helpers$3 = Chart.helpers;
const globalOpts$1 = Chart.defaults.global;

globalOpts$1.elements.candlestick = helpers$3.merge({}, [globalOpts$1.elements.financial, {
	borderColor: globalOpts$1.elements.financial.color.unchanged,
	borderWidth: 1,
}]);

const CandlestickElement = FinancialElement.extend({
	draw() {
		const ctx = this._chart.ctx;
		const vm = this._view;

		const x = vm.x;
		const o = vm.candleOpen;
		const h = vm.candleHigh;
		const l = vm.candleLow;
		const c = vm.candleClose;

		let borderColors = vm.borderColor;
		if (typeof borderColors === 'string') {
			borderColors = {
				up: borderColors,
				down: borderColors,
				unchanged: borderColors
			};
		}

		let borderColor;
		if (c < o) {
			borderColor = helpers$3.getValueOrDefault(borderColors ? borderColors.up : undefined, globalOpts$1.elements.candlestick.borderColor);
			ctx.fillStyle = helpers$3.getValueOrDefault(vm.color ? vm.color.up : undefined, globalOpts$1.elements.candlestick.color.up);
		} else if (c > o) {
			borderColor = helpers$3.getValueOrDefault(borderColors ? borderColors.down : undefined, globalOpts$1.elements.candlestick.borderColor);
			ctx.fillStyle = helpers$3.getValueOrDefault(vm.color ? vm.color.down : undefined, globalOpts$1.elements.candlestick.color.down);
		} else {
			borderColor = helpers$3.getValueOrDefault(borderColors ? borderColors.unchanged : undefined, globalOpts$1.elements.candlestick.borderColor);
			ctx.fillStyle = helpers$3.getValueOrDefault(vm.color ? vm.color.unchanged : undefined, globalOpts$1.elements.candlestick.color.unchanged);
		}

		ctx.lineWidth = helpers$3.getValueOrDefault(vm.borderWidth, globalOpts$1.elements.candlestick.borderWidth);
		ctx.strokeStyle = helpers$3.getValueOrDefault(borderColor, globalOpts$1.elements.candlestick.borderColor);

		ctx.beginPath();
		ctx.moveTo(x, h);
		ctx.lineTo(x, Math.min(o, c));
		ctx.moveTo(x, l);
		ctx.lineTo(x, Math.max(o, c));
		ctx.stroke();
		ctx.fillRect(x - vm.width / 2, c, vm.width, o - c);
		ctx.strokeRect(x - vm.width / 2, c, vm.width, o - c);
		ctx.closePath();
	}
});

Chart.defaults.candlestick = Chart.helpers.merge({}, Chart.defaults.financial);

Chart.defaults._set('global', {
	datasets: {
		candlestick: Chart.defaults.global.datasets.bar
	}
});

const CandlestickController = Chart.controllers.candlestick = FinancialController.extend({
	dataElementType: CandlestickElement,

	updateElement(element, index, reset) {
		const me = this;
		const meta = me.getMeta();
		const dataset = me.getDataset();
		const options = me._resolveDataElementOptions(element, index);

		element._xScale = me.getScaleForId(meta.xAxisID);
		element._yScale = me.getScaleForId(meta.yAxisID);
		element._datasetIndex = me.index;
		element._index = index;

		element._model = {
			datasetLabel: dataset.label || '',
			// label: '', // to get label value please use dataset.data[index].label

			// Appearance
			color: dataset.color,
			borderColor: dataset.borderColor,
			borderWidth: dataset.borderWidth,
		};

		me._updateElementGeometry(element, index, reset, options);

		element.pivot();
	},

});

const helpers$4 = Chart.helpers;
const globalOpts$2 = Chart.defaults.global;

globalOpts$2.elements.ohlc = helpers$4.merge({}, [globalOpts$2.elements.financial, {
	lineWidth: 2,
	armLength: null,
	armLengthRatio: 0.8,
}]);

const OhlcElement = FinancialElement.extend({
	draw() {
		const ctx = this._chart.ctx;
		const vm = this._view;

		const x = vm.x;
		const o = vm.candleOpen;
		const h = vm.candleHigh;
		const l = vm.candleLow;
		const c = vm.candleClose;
		const armLengthRatio = helpers$4.getValueOrDefault(vm.armLengthRatio, globalOpts$2.elements.ohlc.armLengthRatio);
		let armLength = helpers$4.getValueOrDefault(vm.armLength, globalOpts$2.elements.ohlc.armLength);
		if (armLength === null) {
			// The width of an ohlc is affected by barPercentage and categoryPercentage
			// This behavior is caused by extending controller.financial, which extends controller.bar
			// barPercentage and categoryPercentage are now set to 1.0 (see controller.ohlc)
			// and armLengthRatio is multipled by 0.5,
			// so that when armLengthRatio=1.0, the arms from neighbour ohcl touch,
			// and when armLengthRatio=0.0, ohcl are just vertical lines.
			armLength = vm.width * armLengthRatio * 0.5;
		}

		if (c < o) {
			ctx.strokeStyle = helpers$4.getValueOrDefault(vm.color ? vm.color.up : undefined, globalOpts$2.elements.ohlc.color.up);
		} else if (c > o) {
			ctx.strokeStyle = helpers$4.getValueOrDefault(vm.color ? vm.color.down : undefined, globalOpts$2.elements.ohlc.color.down);
		} else {
			ctx.strokeStyle = helpers$4.getValueOrDefault(vm.color ? vm.color.unchanged : undefined, globalOpts$2.elements.ohlc.color.unchanged);
		}
		ctx.lineWidth = helpers$4.getValueOrDefault(vm.lineWidth, globalOpts$2.elements.ohlc.lineWidth);

		ctx.beginPath();
		ctx.moveTo(x, h);
		ctx.lineTo(x, l);
		ctx.moveTo(x - armLength, o);
		ctx.lineTo(x, o);
		ctx.moveTo(x + armLength, c);
		ctx.lineTo(x, c);
		ctx.stroke();
	}
});

Chart.defaults.ohlc = Chart.helpers.merge({}, Chart.defaults.financial);

Chart.defaults._set('global', {
	datasets: {
		ohlc: {
			barPercentage: 1.0,
			categoryPercentage: 1.0
		}
	}
});

const OhlcController = Chart.controllers.ohlc = FinancialController.extend({

	dataElementType: OhlcElement,

	updateElement(element, index, reset) {
		const me = this;
		const meta = me.getMeta();
		const dataset = me.getDataset();
		const options = me._resolveDataElementOptions(element, index);

		element._xScale = me.getScaleForId(meta.xAxisID);
		element._yScale = me.getScaleForId(meta.yAxisID);
		element._datasetIndex = me.index;
		element._index = index;
		element._model = {
			datasetLabel: dataset.label || '',
			lineWidth: dataset.lineWidth,
			armLength: dataset.armLength,
			armLengthRatio: dataset.armLengthRatio,
			color: dataset.color,
		};
		me._updateElementGeometry(element, index, reset, options);
		element.pivot();
	},

});

})));
