'use strict';

import Chart from 'chart.js';
import FinancialController from './controller.financial';
import CandlestickElement from './element.candlestick';

Chart.defaults.candlestick = Chart.helpers.merge({}, Chart.defaults.financial);

class CandlestickController extends FinancialController {

	updateElements(elements, start, mode) {
		const me = this;
		const dataset = me.getDataset();
		const ruler = me._ruler || me._getRuler();

		for (let i = 0; i < elements.length; i++) {
			const index = start + i;
			const options = me.resolveDataElementOptions(index, mode);

			const baseProperties = me.calculateElementProperties(index, ruler, mode === 'reset', options);
			const properties = {
				...baseProperties,
				datasetLabel: dataset.label || '',
				// label: '', // to get label value please use dataset.data[index].label

				// Appearance
				color: dataset.color,
				borderColor: dataset.borderColor,
				borderWidth: dataset.borderWidth,
			};
			properties.options = options;

			me.updateElement(elements[i], index, properties, mode);
		}
	}

}

CandlestickController.prototype.dataElementType = CandlestickElement;
Chart.controllers.candlestick = CandlestickController;

export default CandlestickController;
