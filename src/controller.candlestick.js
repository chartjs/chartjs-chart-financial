import {FinancialController} from './controller.financial';
import {CandlestickElement} from './element.candlestick';
import {BarController} from 'chart.js';

export class CandlestickController extends FinancialController {

  static id = 'candlestick';

  static defaults = {
    ...FinancialController.defaults,
    dataElementType: CandlestickElement.id
  };

  static defaultRoutes = BarController.defaultRoutes;

  updateElements(elements, start, count, mode) {
    const reset = mode === 'reset';
    const ruler = this._getRuler();
    const {sharedOptions, includeOptions} = this._getSharedOptions(start, mode);

    for (let i = start; i < start + count; i++) {
      const options = sharedOptions || this.resolveDataElementOptions(i, mode);

      const baseProperties = this.calculateElementProperties(i, ruler, reset, options);

      if (includeOptions) {
        baseProperties.options = options;
      }
      this.updateElement(elements[i], i, baseProperties, mode);
    }
  }

}
