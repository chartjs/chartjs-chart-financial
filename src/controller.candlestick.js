'use strict';

import Chart from 'chart.js';
import FinancialController from './controller.financial';
import CandlestickElement from './element.candlestick';

Chart.defaults.candlestick = Chart.helpers.merge({}, Chart.defaults.financial);

var CandlestickController = Chart.controllers.candlestick = FinancialController.extend({
	dataElementType: CandlestickElement,

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

		me._updateElementGeometry(element, index, reset);

		element.pivot();
	},

});

export default CandlestickController;
