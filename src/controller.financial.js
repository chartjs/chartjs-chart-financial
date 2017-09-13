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
				categoryPercentage: 0.8,
				barPercentage: 0.9,
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
	Chart.controllers.financial = Chart.controllers.bar.extend({

		dataElementType: Chart.elements.Candlestick,

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
