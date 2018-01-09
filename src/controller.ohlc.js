'use strict';

module.exports = function(Chart) {


	Chart.defaults.ohlc = Chart.defaults.candlestick;
	
	
	Chart.controllers.ohlc = Chart.controllers.candlestick.extend({
		
		dataElementType: Chart.elements.ohlc,
		
		updateElement: function(candle, index, reset) {
			var me = this;
			var meta = me.getMeta();
			var dataset = me.getDataset();
			candle._xScale = me.getScaleForId(meta.xAxisID);
			candle._yScale = me.getScaleForId(meta.yAxisID);
			candle._datasetIndex = me.index;
			candle._index = index;
			candle._model = {
				datasetLabel: dataset.label || '',
				lineWidth: dataset.lineWidth,
				armLength: dataset.armLength,
				armLengthRatio: dataset.armLengthRatio,
				color: dataset.color,
			};
			me.updateElementGeometry(candle, index, reset);
			candle.pivot();
		},
		
	});
};
