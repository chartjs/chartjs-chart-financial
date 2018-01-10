'use strict';

module.exports = function(Chart) {

	Chart.defaults.ohlc = Chart.defaults.financial;

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
