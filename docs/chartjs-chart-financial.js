/*!
 * @license
 * chartjs-chart-financial
 * http://chartjs.org/
 * Version: 0.1.0
 *
 * Copyright 2019 Chart.js Contributors
 * Released under the MIT license
 * https://github.com/chartjs/chartjs-chart-financial/blob/master/LICENSE.md
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js')) :
typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
(global = global || self, factory(global.Chart));
}(this, function (Chart) { 'use strict';

Chart = Chart && Chart.hasOwnProperty('default') ? Chart['default'] : Chart;

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

var helpers$1 = Chart.helpers;

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
			label: function(tooltipItem, data) {
				var dataset = data.datasets[tooltipItem.datasetIndex];
				var point = dataset.data[tooltipItem.index];

				if (!helpers$1.isNullOrUndef(point.y)) {
					return Chart.defaults.global.tooltips.callbacks.label(tooltipItem, data);
				}

				var o = point.o;
				var h = point.h;
				var l = point.l;
				var c = point.c;

				return 'O: ' + o + '  H: ' + h + '  L: ' + l + '  C: ' + c;
			}
		}
	}
};

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
var FinancialController = Chart.controllers.bar.extend({

	dataElementType: Chart.elements.Financial,

	/**
	 * @private
	 */
	_updateElementGeometry: function(element, index, reset, options) {
		var me = this;
		var model = element._model;
		var vscale = me._getValueScale();
		var base = vscale.getBasePixel();
		var horizontal = vscale.isHorizontal();
		var ruler = me._ruler || me.getRuler();
		var vpixels = me.calculateBarValuePixels(me.index, index, options);
		var ipixels = me.calculateBarIndexPixels(me.index, index, ruler, options);
		var chart = me.chart;
		var datasets = chart.data.datasets;
		var indexData = datasets[me.index].data[index];

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

	draw: function() {
		var ctx = this.chart.chart.ctx;
		var elements = this.getMeta().data;
		var dataset = this.getDataset();
		var ilen = elements.length;
		var i = 0;
		var d;

		Chart.canvasHelpers.clipArea(ctx, this.chart.chartArea);

		for (; i < ilen; ++i) {
			d = dataset.data[i].o;
			if (d !== null && d !== undefined && !isNaN(d)) {
				elements[i].draw();
			}
		}

		Chart.canvasHelpers.unclipArea(ctx);
	},
});

var helpers$2 = Chart.helpers;
var globalOpts = Chart.defaults.global;

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
	var vm = candle._view;
	var x1, x2, y1, y2;

	var halfWidth = vm.width / 2;
	x1 = vm.x - halfWidth;
	x2 = vm.x + halfWidth;
	y1 = vm.candleHigh;
	y2 = vm.candleLow;

	return {
		left: x1,
		top: y1,
		right: x2,
		bottom: y2
	};
}

var FinancialElement = Chart.Element.extend({

	height: function() {
		var vm = this._view;
		return vm.base - vm.y;
	},
	inRange: function(mouseX, mouseY) {
		var inRange = false;

		if (this._view) {
			var bounds = getBarBounds(this);
			inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
		}

		return inRange;
	},
	inLabelRange: function(mouseX, mouseY) {
		var me = this;
		if (!me._view) {
			return false;
		}

		var inRange = false;
		var bounds = getBarBounds(me);

		if (isVertical(me)) {
			inRange = mouseX >= bounds.left && mouseX <= bounds.right;
		} else {
			inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
		}

		return inRange;
	},
	inXRange: function(mouseX) {
		var bounds = getBarBounds(this);
		return mouseX >= bounds.left && mouseX <= bounds.right;
	},
	inYRange: function(mouseY) {
		var bounds = getBarBounds(this);
		return mouseY >= bounds.top && mouseY <= bounds.bottom;
	},
	getCenterPoint: function() {
		var vm = this._view;
		return {
			x: vm.x,
			y: (vm.candleHigh + vm.candleLow) / 2
		};
	},
	getArea: function() {
		var vm = this._view;
		return vm.width * Math.abs(vm.y - vm.base);
	},
	tooltipPosition: function() {
		var vm = this._view;
		return {
			x: vm.x,
			y: (vm.candleOpen + vm.candleClose) / 2
		};
	},
	hasValue: function() {
		var model = this._model;
		return helpers$2.isNumber(model.x) &&
			helpers$2.isNumber(model.candleOpen) &&
			helpers$2.isNumber(model.candleHigh) &&
			helpers$2.isNumber(model.candleLow) &&
			helpers$2.isNumber(model.candleClose);
	}
});

var helpers$3 = Chart.helpers;
var globalOpts$1 = Chart.defaults.global;

globalOpts$1.elements.candlestick = helpers$3.merge({}, [globalOpts$1.elements.financial, {
	borderColor: globalOpts$1.elements.financial.color.unchanged,
	borderWidth: 1,
}]);

var CandlestickElement = FinancialElement.extend({
	draw: function() {
		var ctx = this._chart.ctx;
		var vm = this._view;

		var x = vm.x;
		var o = vm.candleOpen;
		var h = vm.candleHigh;
		var l = vm.candleLow;
		var c = vm.candleClose;

		var borderColors = vm.borderColor;
		if (typeof borderColors === 'string') {
			borderColors = {
				up: borderColors,
				down: borderColors,
				unchanged: borderColors
			};
		}

		var borderColor;
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
	},
});

Chart.defaults.candlestick = Chart.helpers.merge({}, Chart.defaults.financial);

Chart.defaults._set('global', {
	datasets: {
		candlestick: Chart.defaults.global.datasets.bar
	}
});

var CandlestickController = Chart.controllers.candlestick = FinancialController.extend({
	dataElementType: CandlestickElement,

	updateElement: function(element, index, reset) {
		var me = this;
		var meta = me.getMeta();
		var dataset = me.getDataset();
		var options = me._resolveDataElementOptions(element, index);

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

var helpers$4 = Chart.helpers;
var globalOpts$2 = Chart.defaults.global;

globalOpts$2.elements.ohlc = helpers$4.merge({}, [globalOpts$2.elements.financial, {
	lineWidth: 2,
	armLength: null,
	armLengthRatio: 0.8,
}]);

var OhlcElement = FinancialElement.extend({
	draw: function() {
		var ctx = this._chart.ctx;
		var vm = this._view;

		var x = vm.x;
		var o = vm.candleOpen;
		var h = vm.candleHigh;
		var l = vm.candleLow;
		var c = vm.candleClose;
		var armLength = helpers$4.getValueOrDefault(vm.armLength, globalOpts$2.elements.ohlc.armLength);
		var armLengthRatio = helpers$4.getValueOrDefault(vm.armLengthRatio, globalOpts$2.elements.ohlc.armLengthRatio);
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
	},
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

var OhlcController = Chart.controllers.ohlc = FinancialController.extend({

	dataElementType: OhlcElement,

	updateElement: function(element, index, reset) {
		var me = this;
		var meta = me.getMeta();
		var dataset = me.getDataset();
		var options = me._resolveDataElementOptions(element, index);

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

}));
