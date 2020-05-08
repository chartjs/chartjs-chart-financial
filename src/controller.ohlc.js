'use strict';

import Chart from 'chart.js';
import FinancialController from './controller.financial';
import OhlcElement from './element.ohlc';

Chart.defaults.ohlc = Chart.helpers.merge({}, Chart.defaults.financial);
Chart.defaults.set('ohlc', {
	datasets: {
		barPercentage: 1.0,
		categoryPercentage: 1.0
	}
});

class OhlcController extends FinancialController {

	updateElements(elements, start, mode) {
		for (let i = 0; i < elements.length; i++) {
			const me = this;
			const dataset = me.getDataset();
			const index = start + i;
			const options = me.resolveDataElementOptions(index, mode);

			const baseProperties = me.calculateElementProperties(index, mode === 'reset', options);
			const properties = {
				...baseProperties,
				datasetLabel: dataset.label || '',
				lineWidth: dataset.lineWidth,
				armLength: dataset.armLength,
				armLengthRatio: dataset.armLengthRatio,
				color: dataset.color,
			};
			properties.options = options;

			me.updateElement(elements[i], index, properties, mode);
		}
	}

}

OhlcController.prototype.dataElementType = OhlcElement;
Chart.controllers.ohlc = OhlcController;

export default OhlcController;
