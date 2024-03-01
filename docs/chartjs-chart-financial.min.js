/*!
 * @license
 * chartjs-chart-financial
 * http://chartjs.org/
 * Version: 0.2.0
 *
 * Copyright 2024 Chart.js Contributors
 * Released under the MIT license
 * https://github.com/chartjs/chartjs-chart-financial/blob/master/LICENSE.md
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chart.js'), require('chart.js/helpers')) :
typeof define === 'function' && define.amd ? define(['chart.js', 'chart.js/helpers'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Chart, global.Chart.helpers));
})(this, (function (chart_js, helpers) { 'use strict';

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
class FinancialController extends chart_js.BarController {

  static overrides = {
    label: '',

    parsing: false,

    hover: {
      mode: 'label'
    },
    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'base', 'width', 'open', 'high', 'low', 'close']
      }
    },

    scales: {
      x: {
        type: 'timeseries',
        offset: true,
        ticks: {
          major: {
            enabled: true,
          },
          source: 'data',
          maxRotation: 0,
          autoSkip: true,
          autoSkipPadding: 75,
          sampleSize: 100
        },
      },
      y: {
        type: 'linear'
      }
    },

    plugins: {
      tooltip: {
        intersect: false,
        mode: 'index',
        callbacks: {
          label(ctx) {
            const point = ctx.parsed;

            if (!helpers.isNullOrUndef(point.y)) {
              return chart_js.defaults.plugins.tooltip.callbacks.label(ctx);
            }

            const {o, h, l, c} = point;

            return `O: ${o}  H: ${h}  L: ${l}  C: ${c}`;
          }
        }
      }
    }
  };

  getLabelAndValue(index) {
    const me = this;
    const parsed = me.getParsed(index);
    const axis = me._cachedMeta.iScale.axis;

    const {o, h, l, c} = parsed;
    const value = `O: ${o}  H: ${h}  L: ${l}  C: ${c}`;

    return {
      label: `${me._cachedMeta.iScale.getLabelForValue(parsed[axis])}`,
      value
    };
  }

  getUserBounds(scale) {
    const {min, max, minDefined, maxDefined} = scale.getUserBounds();
    return {
      min: minDefined ? min : Number.NEGATIVE_INFINITY,
      max: maxDefined ? max : Number.POSITIVE_INFINITY
    };
  }

  /**
	 * Implement this ourselves since it doesn't handle high and low values
	 * https://github.com/chartjs/Chart.js/issues/7328
	 * @protected
	 */
  getMinMax(scale) {
    const meta = this._cachedMeta;
    const _parsed = meta._parsed;
    const axis = meta.iScale.axis;
    const otherScale = this._getOtherScale(scale);
    const {min: otherMin, max: otherMax} = this.getUserBounds(otherScale);

    if (_parsed.length < 2) {
      return {min: 0, max: 1};
    }

    if (scale === meta.iScale) {
      return {min: _parsed[0][axis], max: _parsed[_parsed.length - 1][axis]};
    }

    const newParsedData = _parsed.filter(({x}) => x >= otherMin && x < otherMax);

    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < newParsedData.length; i++) {
      const data = newParsedData[i];
      min = Math.min(min, data.l);
      max = Math.max(max, data.h);
    }
    return {min, max};
  }

  /**
	 * @protected
	 */
  calculateElementProperties(index, ruler, reset, options) {
    const me = this;
    const vscale = me._cachedMeta.vScale;
    const base = vscale.getBasePixel();
    const ipixels = me._calculateBarIndexPixels(index, ruler, options);
    const data = me.chart.data.datasets[me.index].data[index];
    const open = vscale.getPixelForValue(data.o);
    const high = vscale.getPixelForValue(data.h);
    const low = vscale.getPixelForValue(data.l);
    const close = vscale.getPixelForValue(data.c);

    return {
      base: reset ? base : low,
      x: ipixels.center,
      y: (low + high) / 2,
      width: ipixels.size,
      open,
      high,
      low,
      close
    };
  }

  draw() {
    const me = this;
    const chart = me.chart;
    const rects = me._cachedMeta.data;
    helpers.clipArea(chart.ctx, chart.chartArea);
    for (let i = 0; i < rects.length; ++i) {
      rects[i].draw(me._ctx);
    }
    helpers.unclipArea(chart.ctx);
  }

}

/**
 * Helper function to get the bounds of the bar regardless of the orientation
 * @param {Rectangle} bar the bar
 * @param {boolean} [useFinalPosition]
 * @return {object} bounds of the bar
 * @private
 */
function getBarBounds(bar, useFinalPosition) {
  const {x, y, base, width, height} = bar.getProps(['x', 'low', 'high', 'width', 'height'], useFinalPosition);

  let left, right, top, bottom, half;

  if (bar.horizontal) {
    half = height / 2;
    left = Math.min(x, base);
    right = Math.max(x, base);
    top = y - half;
    bottom = y + half;
  } else {
    half = width / 2;
    left = x - half;
    right = x + half;
    top = Math.min(y, base); // use min because 0 pixel at top of screen
    bottom = Math.max(y, base);
  }

  return {left, top, right, bottom};
}

function inRange(bar, x, y, useFinalPosition) {
  const skipX = x === null;
  const skipY = y === null;
  const bounds = !bar || (skipX && skipY) ? false : getBarBounds(bar, useFinalPosition);

  return bounds
		&& (skipX || x >= bounds.left && x <= bounds.right)
		&& (skipY || y >= bounds.top && y <= bounds.bottom);
}

class FinancialElement extends chart_js.BarElement {

  static defaults = {
    backgroundColors: {
      up: 'rgba(75, 192, 192, 0.5)',
      down: 'rgba(255, 99, 132, 0.5)',
      unchanged: 'rgba(201, 203, 207, 0.5)',
    },
    borderColors: {
      up: 'rgb(75, 192, 192)',
      down: 'rgb(255, 99, 132)',
      unchanged: 'rgb(201, 203, 207)',
    }
  };

  height() {
    return this.base - this.y;
  }

  inRange(mouseX, mouseY, useFinalPosition) {
    return inRange(this, mouseX, mouseY, useFinalPosition);
  }

  inXRange(mouseX, useFinalPosition) {
    return inRange(this, mouseX, null, useFinalPosition);
  }

  inYRange(mouseY, useFinalPosition) {
    return inRange(this, null, mouseY, useFinalPosition);
  }

  getRange(axis) {
    return axis === 'x' ? this.width / 2 : this.height / 2;
  }

  getCenterPoint(useFinalPosition) {
    const {x, low, high} = this.getProps(['x', 'low', 'high'], useFinalPosition);
    return {
      x,
      y: (high + low) / 2
    };
  }

  tooltipPosition(useFinalPosition) {
    const {x, open, close} = this.getProps(['x', 'open', 'close'], useFinalPosition);
    return {
      x,
      y: (open + close) / 2
    };
  }
}

class CandlestickElement extends FinancialElement {
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
      borderColor = helpers.valueOrDefault(borderColors ? borderColors.up : undefined, chart_js.defaults.elements.candlestick.borderColors.up);
      ctx.fillStyle = helpers.valueOrDefault(me.options.backgroundColors ? me.options.backgroundColors.up : undefined, chart_js.defaults.elements.candlestick.backgroundColors.up);
    } else if (close > open) {
      borderColor = helpers.valueOrDefault(borderColors ? borderColors.down : undefined, chart_js.defaults.elements.candlestick.borderColors.down);
      ctx.fillStyle = helpers.valueOrDefault(me.options.backgroundColors ? me.options.backgroundColors.down : undefined, chart_js.defaults.elements.candlestick.backgroundColors.down);
    } else {
      borderColor = helpers.valueOrDefault(borderColors ? borderColors.unchanged : undefined, chart_js.defaults.elements.candlestick.borderColors.unchanged);
      ctx.fillStyle = helpers.valueOrDefault(me.backgroundColors ? me.backgroundColors.unchanged : undefined, chart_js.defaults.elements.candlestick.backgroundColors.unchanged);
    }

    ctx.lineWidth = helpers.valueOrDefault(me.options.borderWidth, chart_js.defaults.elements.candlestick.borderWidth);
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

class CandlestickController extends FinancialController {

  static id = 'candlestick';

  static defaults = {
    ...FinancialController.defaults,
    dataElementType: CandlestickElement.id
  };

  static defaultRoutes = chart_js.BarController.defaultRoutes;

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

const defaults = chart_js.Chart.defaults;

class OhlcElement extends FinancialElement {
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

    const armLengthRatio = helpers.valueOrDefault(me.armLengthRatio, defaults.elements.ohlc.armLengthRatio);
    let armLength = helpers.valueOrDefault(me.armLength, defaults.elements.ohlc.armLength);
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
      ctx.strokeStyle = helpers.valueOrDefault(me.options.borderColors ? me.options.borderColors.up : undefined, defaults.elements.ohlc.borderColors.up);
    } else if (close > open) {
      ctx.strokeStyle = helpers.valueOrDefault(me.options.borderColors ? me.options.borderColors.down : undefined, defaults.elements.ohlc.borderColors.down);
    } else {
      ctx.strokeStyle = helpers.valueOrDefault(me.options.borderColors ? me.options.borderColors.unchanged : undefined, defaults.elements.ohlc.borderColors.unchanged);
    }
    ctx.lineWidth = helpers.valueOrDefault(me.lineWidth, defaults.elements.ohlc.lineWidth);

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

class OhlcController extends FinancialController {
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

chart_js.Chart.register(CandlestickController, OhlcController, CandlestickElement, OhlcElement);

}));
