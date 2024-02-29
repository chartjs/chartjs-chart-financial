import {FinancialController} from './controller.financial';
import {OhlcElement} from './element.ohlc';

export class OhlcController extends FinancialController {
  static id = 'ohlc';

  static defaults = {
    ...FinancialController.defaults,
    dataElementType: OhlcElement.id,
    datasets: {
      barPercentage: 1.0,
      categoryPercentage: 1.0
    }
  };

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
