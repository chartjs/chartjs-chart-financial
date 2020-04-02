'use strict';

import Chart from 'chart.js';
import FinancialController from './controller.financial';
import CandlestickElement from './element.candlestick';

Chart.defaults.candlestick = Chart.helpers.merge({}, Chart.defaults.financial);

Chart.defaults._set('global', {
	datasets: {
		candlestick: Chart.defaults.global.datasets.bar
	}
});

const CandlestickController = Chart.controllers.candlestick = FinancialController.extend({
	dataElementType: CandlestickElement,

	updateElement(element, index, reset) {
		const me = this;
		const meta = me.getMeta();
		const dataset = me.getDataset();
		const options = me._resolveDataElementOptions(element, index);

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

		me._updateElementGeometry(element, index, reset, options);

		element.pivot();
	},

});

export default CandlestickController;
