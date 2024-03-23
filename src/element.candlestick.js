import {FinancialElement} from './element.financial';
import {valueOrDefault} from 'chart.js/helpers';
import {defaults} from 'chart.js';

export class CandlestickElement extends FinancialElement {
  static id = 'candlestick';

  static defaults = {
    ...FinancialElement.defaults,
    borderWidth: 1,
  };

  draw(ctx) {
    const me = this;

    const {x, open, high, low, close} = me;

    let borderColors = me.options.borderColors;
    if (typeof borderColors === 'string') {
      borderColors = {
        up: borderColors,
        down: borderColors,
        unchanged: borderColors
      };
    }

    let borderColor;
    if (close < open) {
      borderColor = valueOrDefault(borderColors ? borderColors.up : undefined, defaults.elements.candlestick.borderColors.up);
      ctx.fillStyle = valueOrDefault(me.options.backgroundColors ? me.options.backgroundColors.up : undefined, defaults.elements.candlestick.backgroundColors.up);
    } else if (close > open) {
      borderColor = valueOrDefault(borderColors ? borderColors.down : undefined, defaults.elements.candlestick.borderColors.down);
      ctx.fillStyle = valueOrDefault(me.options.backgroundColors ? me.options.backgroundColors.down : undefined, defaults.elements.candlestick.backgroundColors.down);
    } else {
      borderColor = valueOrDefault(borderColors ? borderColors.unchanged : undefined, defaults.elements.candlestick.borderColors.unchanged);
      ctx.fillStyle = valueOrDefault(me.backgroundColors ? me.backgroundColors.unchanged : undefined, defaults.elements.candlestick.backgroundColors.unchanged);
    }

    ctx.lineWidth = valueOrDefault(me.options.borderWidth, defaults.elements.candlestick.borderWidth);
    ctx.strokeStyle = borderColor;

    ctx.beginPath();
    ctx.moveTo(x, high);
    ctx.lineTo(x, Math.min(open, close));
    ctx.moveTo(x, low);
    ctx.lineTo(x, Math.max(open, close));
    ctx.stroke();
    ctx.fillRect(x - me.width / 2, close, me.width, open - close);
    ctx.strokeRect(x - me.width / 2, close, me.width, open - close);
    ctx.closePath();
  }
}
