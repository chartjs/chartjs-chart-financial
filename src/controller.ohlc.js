'use strict';

import Chart from 'chart.js';
import FinancialController from './controller.financial';
import OhlcElement from './element.ohlc';

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

export default OhlcController;
