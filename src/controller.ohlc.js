'use strict';


var helpers = Chart.helpers;


module.exports = function(Chart) {
	Chart.defaults.ohlc = Chart.defaults.financial;
	Chart.controllers.ohlc = Chart.controllers.financial.extend({
		
		
		dataElementType: Chart.elements.ohlc,
		
		
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
				lineWidth: dataset.lineWidth,
				armLength: dataset.armLength,
				color: dataset.color,
				armLength: dataset.armLength,
			};
			me.updateElementGeometry(candle, index, reset);
			candle.pivot();
		},
		
		
	});
};
