'use strict';

import {Chart} from 'chart.js';
import {valueOrDefault} from 'chart.js/helpers';
import {FinancialElement} from './element.financial';

const defaults = Chart.defaults;

export class OhlcElement extends FinancialElement {
  static id = 'ohlc';

  static defaults = {
    ...FinancialElement.defaults,
    lineWidth: 2,
    armLength: null,
    armLengthRatio: 0.8
  };

  draw(ctx) {
    const me = this;

    const {x, open, high, low, close} = me;

    const armLengthRatio = valueOrDefault(me.armLengthRatio, defaults.elements.ohlc.armLengthRatio);
    let armLength = valueOrDefault(me.armLength, defaults.elements.ohlc.armLength);
    if (armLength === null) {
      // The width of an ohlc is affected by barPercentage and categoryPercentage
      // This behavior is caused by extending controller.financial, which extends controller.bar
      // barPercentage and categoryPercentage are now set to 1.0 (see controller.ohlc)
      // and armLengthRatio is multipled by 0.5,
      // so that when armLengthRatio=1.0, the arms from neighbour ohcl touch,
      // and when armLengthRatio=0.0, ohcl are just vertical lines.
      armLength = me.width * armLengthRatio * 0.5;
    }

    if (close < open) {
      ctx.strokeStyle = valueOrDefault(me.options.borderColors ? me.options.borderColors.up : undefined, defaults.elements.ohlc.borderColors.up);
    } else if (close > open) {
      ctx.strokeStyle = valueOrDefault(me.options.borderColors ? me.options.borderColors.down : undefined, defaults.elements.ohlc.borderColors.down);
    } else {
      ctx.strokeStyle = valueOrDefault(me.options.borderColors ? me.options.borderColors.unchanged : undefined, defaults.elements.ohlc.borderColors.unchanged);
    }
    ctx.lineWidth = valueOrDefault(me.lineWidth, defaults.elements.ohlc.lineWidth);

    ctx.beginPath();
    ctx.moveTo(x, high);
    ctx.lineTo(x, low);
    ctx.moveTo(x - armLength, open);
    ctx.lineTo(x, open);
    ctx.moveTo(x + armLength, close);
    ctx.lineTo(x, close);
    ctx.stroke();
  }
}
