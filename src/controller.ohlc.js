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
