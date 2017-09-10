'use strict';

var helpers = Chart.helpers;

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
				time: {
					format: 'll'
				},
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

					return ' O ' + o + ' H ' + h + ' L ' + l + ' C ' + c;
				}
			}
		}
	};

	/**
	 * This class is based off controller.bar.js from the upstream Chart.js library
	 */
	Chart.controllers.financial = Chart.DatasetController.extend({

		dataElementType: Chart.elements.Candlestick,

		initialize: function() {
			var me = this;
			var meta;

			Chart.DatasetController.prototype.initialize.apply(me, arguments);

			meta = me.getMeta();
			meta.stack = me.getDataset().stack;
			meta.bar = true;
		},

		update: function(reset) {
			var me = this;
			var elements = me.getMeta().data;
			var i, ilen;

			me._ruler = me.getRuler();

			for (i = 0, ilen = elements.length; i < ilen; ++i) {
				me.updateElement(elements[i], i, reset);
			}
		},

		updateElement: function(candle, index, reset) {
			var me = this;
			var chart = me.chart;
			var meta = me.getMeta();
			var dataset = me.getDataset();
			var custom = candle.custom || {};

			candle._xScale = me.getScaleForId(meta.xAxisID);
			candle._yScale = me.getScaleForId(meta.yAxisID);
			candle._datasetIndex = me.index;
			candle._index = index;

			candle._model = {
				datasetLabel: dataset.label || '',
				//label: '', // to get label value please use dataset.data[index].label

				// Appearance
				upCandleColor: dataset.upCandleColor,
				downCandleColor: dataset.downCandleColor,
				outlineCandleColor: dataset.outlineCandleColor,
				outlineCandleWidth: dataset.outlineCandleWidth,
			};

			me.updateElementGeometry(candle, index, reset);

			candle.pivot();
		},

		/**
		 * @private
		 */
		updateElementGeometry: function(rectangle, index, reset) {
			var me = this;
			var model = rectangle._model;
			var vscale = me.getValueScale();
			var base = vscale.getBasePixel();
			var horizontal = vscale.isHorizontal();
			var ruler = me._ruler || me.getRuler();
			var vpixels = me.calculateBarValuePixels(me.index, index);
			var ipixels = me.calculateBarIndexPixels(me.index, index, ruler);
			var candle = me.calculateCandleValuesPixels(me.index, index);

			model.horizontal = horizontal;
			model.base = reset ? base : vpixels.base;
			model.x = horizontal ? reset ? base : vpixels.head : ipixels.center;
			model.y = horizontal ? ipixels.center : reset ? base : vpixels.head;
			model.height = horizontal ? ipixels.size : undefined;
			model.width = horizontal ? undefined : ipixels.size;
			model.candle = candle;
		},

		/**
		 * @private
		 */
		getValueScaleId: function() {
			return this.getMeta().yAxisID;
		},

		/**
		 * @private
		 */
		getIndexScaleId: function() {
			return this.getMeta().xAxisID;
		},

		/**
		 * @private
		 */
		getValueScale: function() {
			return this.getScaleForId(this.getValueScaleId());
		},

		/**
		 * @private
		 */
		getIndexScale: function() {
			return this.getScaleForId(this.getIndexScaleId());
		},

		/**
		 * Returns the effective number of stacks based on groups and bar visibility.
		 * @private
		 */
		getStackCount: function(last) {
			var me = this;
			var chart = me.chart;
			var scale = me.getIndexScale();
			var stacked = scale.options.stacked;
			var ilen = last === undefined ? chart.data.datasets.length : last + 1;
			var stacks = [];
			var i, meta;

			for (i = 0; i < ilen; ++i) {
				meta = chart.getDatasetMeta(i);
				if (meta.bar && chart.isDatasetVisible(i) &&
					(stacked === false ||
						(stacked === true && stacks.indexOf(meta.stack) === -1) ||
						(stacked === undefined && (meta.stack === undefined || stacks.indexOf(meta.stack) === -1)))) {
					stacks.push(meta.stack);
				}
			}

			return stacks.length;
		},

		/**
		 * Returns the stack index for the given dataset based on groups and bar visibility.
		 * @private
		 */
		getStackIndex: function(datasetIndex) {
			return this.getStackCount(datasetIndex) - 1;
		},

		/**
		 * @private
		 */
		getRuler: function() {
			var me = this;
			var scale = me.getIndexScale();
			var stackCount = me.getStackCount();
			var datasetIndex = me.index;
			var pixels = [];
			var isHorizontal = scale.isHorizontal();
			var start = isHorizontal ? scale.left : scale.top;
			var end = start + (isHorizontal ? scale.width : scale.height);
			var i, ilen;

			for (i = 0, ilen = me.getMeta().data.length; i < ilen; ++i) {
				pixels.push(scale.getPixelForValue(null, i, datasetIndex));
			}

			return {
				pixels: pixels,
				start: start,
				end: end,
				stackCount: stackCount,
				scale: scale
			};
		},

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

		/**
		 * Note: pixel values are not clamped to the scale area.
		 * @private
		 */
		calculateBarValuePixels: function(datasetIndex, index) {
			var me = this;
			var chart = me.chart;
			var meta = me.getMeta();
			var scale = me.getValueScale();
			var datasets = chart.data.datasets;
			var value = datasets[datasetIndex].data[index].h;
			var start = datasets[datasetIndex].data[index].l;
			var i, imeta, ivalue, base, head, size;

			base = scale.getPixelForValue(start);
			head = scale.getPixelForValue(value);
			size = (head - base) / 2;

			return {
				size: size,
				base: base,
				head: head,
				center: head + size / 2
			};
		},

		/**
		 * @private
		 */
		calculateBarIndexPixels: function(datasetIndex, index, ruler) {
			var me = this;
			var options = ruler.scale.options;
			var stackIndex = me.getStackIndex(datasetIndex);
			var pixels = ruler.pixels;
			var base = pixels[index];
			var length = pixels.length;
			var start = ruler.start;
			var end = ruler.end;
			var leftSampleSize, rightSampleSize, leftCategorySize, rightCategorySize, fullBarSize, size;

			if (length === 1) {
				leftSampleSize = base > start ? base - start : end - base;
				rightSampleSize = base < end ? end - base : base - start;
			} else {
				if (index > 0) {
					leftSampleSize = (base - pixels[index - 1]) / 2;
					if (index === length - 1) {
						rightSampleSize = leftSampleSize;
					}
				}
				if (index < length - 1) {
					rightSampleSize = (pixels[index + 1] - base) / 2;
					if (index === 0) {
						leftSampleSize = rightSampleSize;
					}
				}
			}

			// options.categoryPercentage is undefined for time scale
			//leftCategorySize = leftSampleSize * options.categoryPercentage;
			//rightCategorySize = rightSampleSize * options.categoryPercentage;
			leftCategorySize = leftSampleSize * 0.8;
			rightCategorySize = rightSampleSize * 0.8;
			fullBarSize = (leftCategorySize + rightCategorySize) / ruler.stackCount;
			// options.barPercentage is undefined for time scale
			//size = fullBarSize * options.barPercentage;
			size = fullBarSize * 0.9;

			size = Math.min(
				helpers.valueOrDefault(options.barThickness, size),
				helpers.valueOrDefault(options.maxBarThickness, Infinity));

			base -= leftCategorySize;
			base += fullBarSize * stackIndex;
			base += (fullBarSize - size) / 2;

			return {
				size: size,
				base: base,
				head: base + size,
				center: base + size / 2
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

		removeHoverStyle: function(element, elementOpts) {
			
		},

		setHoverStyle: function(element) {
			
		},

	});
};
