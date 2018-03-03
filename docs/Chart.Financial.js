/*!
 * chartjs-chart-financial
 * Version: 0.1.0
 *
 * Copyright 2017 chartjs-chart-financial contributors
 * Released under the MIT license
 * https://github.com/chartjs/chartjs-chart-financial/blob/master/LICENSE.md
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.defaults.candlestick = Object.assign({}, Chart.defaults.financial);
	Chart.defaults.candlestick.scales = {
		xAxes: [Object.assign({}, Chart.defaults.financial.scales.xAxes[0])],
		yAxes: [Object.assign({}, Chart.defaults.financial.scales.yAxes[0])]
	};

	Chart.controllers.candlestick = Chart.controllers.financial.extend({
		dataElementType: Chart.elements.Candlestick,

		updateElement: function(element, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var dataset = me.getDataset();

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

			me.updateElementGeometry(element, index, reset);

			element.pivot();
		},

	});

};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.defaults.financial = {
		label: '',

		hover: {
			mode: 'label'
		},

		scales: {
			xAxes: [{
				type: 'time',
				distribution: 'series',
				categoryPercentage: 0.8,
				barPercentage: 0.9,
				ticks: {
					source: 'data'
				}
			}],
			yAxes: [{
				type: 'financialLinear'
			}]
		},

		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					var o = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].o;
					var h = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].h;
					var l = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].l;
					var c = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].c;

					var fractionalDigitsCount = data.datasets[tooltipItem.datasetIndex].fractionalDigitsCount;
					if (fractionalDigitsCount !== undefined) {
						fractionalDigitsCount = Math.max(0, Math.min(100, fractionalDigitsCount));
						o = o.toFixed(fractionalDigitsCount);
						h = h.toFixed(fractionalDigitsCount);
						l = l.toFixed(fractionalDigitsCount);
						c = c.toFixed(fractionalDigitsCount);
					}

					return ' O: ' + o + '    H: ' + h + '    L: ' + l + '    C: ' + c;
				}
			}
		}
	};

	/**
	 * This class is based off controller.bar.js from the upstream Chart.js library
	 */
	Chart.controllers.financial = Chart.controllers.bar.extend({

		dataElementType: Chart.elements.Financial,

		/**
		 * @private
		 */
		updateElementGeometry: function(element, index, reset) {
			var me = this;
			var model = element._model;
			var vscale = me.getValueScale();
			var base = vscale.getBasePixel();
			var horizontal = vscale.isHorizontal();
			var ruler = me._ruler || me.getRuler();
			var vpixels = me.calculateBarValuePixels(me.index, index);
			var ipixels = me.calculateBarIndexPixels(me.index, index, ruler);

			model.horizontal = horizontal;
			model.base = reset ? base : vpixels.base;
			model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
			model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
			model.height = horizontal ? ipixels.size : undefined;
			model.width = horizontal ? undefined : ipixels.size;
			model.candle = me.calculateCandleValuesPixels(me.index, index);
		},

		/**
		 * @private
		 */
		calculateCandleValuesPixels: function(datasetIndex, index) {
			var me = this;
			var chart = me.chart;
			var scale = me.getValueScale();
			var datasets = chart.data.datasets;

			return {
				o: scale.getPixelForValue(Number(datasets[datasetIndex].data[index].o)),
				h: scale.getPixelForValue(Number(datasets[datasetIndex].data[index].h)),
				l: scale.getPixelForValue(Number(datasets[datasetIndex].data[index].l)),
				c: scale.getPixelForValue(Number(datasets[datasetIndex].data[index].c))
			};
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
};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	Chart.defaults.ohlc = Object.assign({}, Chart.defaults.financial);
	Chart.defaults.ohlc.scales = {
		xAxes: [Object.assign({}, Chart.defaults.financial.scales.xAxes[0])],
		yAxes: [Object.assign({}, Chart.defaults.financial.scales.yAxes[0])]
	};
	Chart.defaults.ohlc.scales.xAxes[0].barPercentage = 1.0;
	Chart.defaults.ohlc.scales.xAxes[0].categoryPercentage = 1.0;

	Chart.controllers.ohlc = Chart.controllers.financial.extend({

		dataElementType: Chart.elements.Ohlc,

		updateElement: function(element, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var dataset = me.getDataset();
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
			me.updateElementGeometry(element, index, reset);
			element.pivot();
		},

	});
};

},{}],5:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalOpts = Chart.defaults.global;

	globalOpts.elements.candlestick = Object.assign(globalOpts.elements.financial, {
		borderColor: globalOpts.elements.financial.color.unchanged,
		borderWidth: 1,
	});

	Chart.elements.Candlestick = Chart.elements.Financial.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			var x = vm.x;
			var o = vm.candle.o;
			var h = vm.candle.h;
			var l = vm.candle.l;
			var c = vm.candle.c;

			ctx.strokeStyle = helpers.getValueOrDefault(vm.borderColor, globalOpts.elements.candlestick.borderColor);
			ctx.lineWidth = helpers.getValueOrDefault(vm.borderWidth, globalOpts.elements.candlestick.borderWidth);
			if (c < o) {
				ctx.fillStyle = helpers.getValueOrDefault(vm.color ? vm.color.up : undefined, globalOpts.elements.candlestick.color.up);
			} else if (c > o) {
				ctx.fillStyle = helpers.getValueOrDefault(vm.color ? vm.color.down : undefined, globalOpts.elements.candlestick.color.down);
			} else {
				ctx.fillStyle = helpers.getValueOrDefault(vm.color ? vm.color.unchanged : undefined, globalOpts.elements.candlestick.color.unchanged);
			}

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
};

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var globalOpts = Chart.defaults.global;

	globalOpts.elements.financial = {
		color: {
			up: 'rgba(80, 160, 115, 1)',
			down: 'rgba(215, 85, 65, 1)',
			unchanged: 'rgba(90, 90, 90, 1)',
		},
		fractionalDigitsCount: undefined,
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
		y1 = vm.candle.h;
		y2 = vm.candle.l;


		return {
			left: x1,
			top: y1,
			right: x2,
			bottom: y2
		};
	}

	Chart.elements.Financial = Chart.Element.extend({

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
			var x, y;

			var halfWidth = vm.width / 2;
			x = vm.x - halfWidth;
			y = (vm.candle.h + vm.candle.l) / 2;

			return {x: x, y: y};
		},
		getArea: function() {
			var vm = this._view;
			return vm.width * Math.abs(vm.y - vm.base);
		},
		tooltipPosition: function() {
			var vm = this._view;
			return {
				x: vm.x,
				y: (vm.candle.h + vm.candle.l) / 2
			};
		}
	});

};


},{}],7:[function(require,module,exports){
'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalOpts = Chart.defaults.global;

	globalOpts.elements.ohlc = Object.assign(globalOpts.elements.financial, {
		lineWidth: 2,
		armLength: null,
		armLengthRatio: 0.8,
	});

	Chart.elements.Ohlc = Chart.elements.Financial.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			var x = vm.x;
			var o = vm.candle.o;
			var h = vm.candle.h;
			var l = vm.candle.l;
			var c = vm.candle.c;
			var armLength = helpers.getValueOrDefault(vm.armLength, globalOpts.elements.ohlc.armLength);
			var armLengthRatio = helpers.getValueOrDefault(vm.armLengthRatio, globalOpts.elements.ohlc.armLengthRatio);
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
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color ? vm.color.up : undefined, globalOpts.elements.ohlc.color.up);
			} else if (c > o) {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color ? vm.color.down : undefined, globalOpts.elements.ohlc.color.down);
			} else {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color ? vm.color.unchanged : undefined, globalOpts.elements.ohlc.color.unchanged);
			}
			ctx.lineWidth = helpers.getValueOrDefault(vm.lineWidth, globalOpts.elements.ohlc.lineWidth);

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
};

},{}],8:[function(require,module,exports){
'use strict';

var Chart = require('chart.js');
Chart = typeof Chart === 'function' ? Chart : window.Chart;

require('./scale.financialLinear.js')(Chart);

require('./element.financial.js')(Chart);
require('./element.candlestick.js')(Chart);
require('./element.ohlc.js')(Chart);

require('./controller.financial.js')(Chart);
require('./controller.candlestick.js')(Chart);
require('./controller.ohlc.js')(Chart);

},{"./controller.candlestick.js":2,"./controller.financial.js":3,"./controller.ohlc.js":4,"./element.candlestick.js":5,"./element.financial.js":6,"./element.ohlc.js":7,"./scale.financialLinear.js":9,"chart.js":1}],9:[function(require,module,exports){
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

},{}]},{},[8]);
