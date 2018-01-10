'use strict';

module.exports = function(Chart) {

	Chart.defaults.candlestick = Chart.defaults.financial;

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
				//label: '', // to get label value please use dataset.data[index].label

				// Appearance
				color: dataset.color,
				border: dataset.border,
			};

			me.updateElementGeometry(element, index, reset);

			element.pivot();
		},

	});

};
