import {BarController, defaults} from 'chart.js';
import {clipArea, isNullOrUndef, unclipArea} from 'chart.js/helpers';

/**
 * This class is based off controller.bar.js from the upstream Chart.js library
 */
export class FinancialController extends BarController {

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

            if (!isNullOrUndef(point.y)) {
              return defaults.plugins.tooltip.callbacks.label(ctx);
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
    clipArea(chart.ctx, chart.chartArea);
    for (let i = 0; i < rects.length; ++i) {
      rects[i].draw(me._ctx);
    }
    unclipArea(chart.ctx);
  }

}
