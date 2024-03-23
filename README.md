# Chart.js Financial Charting

Chart.js module for Candlestick and OHLC charts

## Roadmap

Chart.js 2.7.0 added our timeseries scale as new option called [`distribution: series`](http://www.chartjs.org/docs/latest/axes/cartesian/time.html). This has greatly improved support for financial timeseries.

Chart.js 2.7.1 added [fixes for timeseries](https://github.com/chartjs/Chart.js/pull/4779).

Chart.js 2.7.2 added [formatting of timestamps in tooltips](https://github.com/chartjs/Chart.js/pull/5095).

Chart.js 2.7.3 included a [fix for hovering](https://github.com/chartjs/Chart.js/pull/5570).

Chart.js 2.8.0 added datetime adapters and [time scale performance improvements](https://github.com/chartjs/Chart.js/pull/6019). This allows users to use a datetime library of their choosing such as [Luxon](https://moment.github.io/luxon/) in order to get i18n and timezone support

Chart.js 2.9.0 added [improved autoskipping](https://github.com/chartjs/Chart.js/pull/6509), [support for floating bars](https://github.com/chartjs/Chart.js/pull/6056), [better support for mixed chart types](https://github.com/chartjs/Chart.js/pull/5999), and [numerous performance improvements](https://github.com/chartjs/Chart.js/releases/tag/v2.9.0).

Chart.js 3.0.0 removed the need for custom scales, which means logarithmic scale is now supported. It also has numerous performance improvements.

Chart.js 4.0.0 has some breaking changes that required modifying this library configuration. Check the updated examples to see which changes are necessary.

## Comparison

We are aiming to make Chart.js the only popular JavaScript library that is both performant and has good timescale handling.

Most chart libraries don't have great handling of timescale axes and will not always choose the first of the month, year, etc. as labels. This library leverages the concept of major ticks that we introduced in Chart.js. E.g. it will make sure that the first day of each month is plotted before plotting days in between.

One of the best libraries we've found for financial charts is [react-stockcharts](https://github.com/rrag/react-stockcharts). However, it ties the user to utilizing React.

Because Chart.js utilizes canvas it is more performant than the majority of JavaScript charting libraries. In a [benchmark of the fastest JavaScript chart libraries](https://github.com/leeoniya/uPlot#performance), Chart.js performs respectably. Chart.js is slower than some of the fastest libraries like uPlot because it accepts varied input (parsing, linear and timeseries support in time scale, etc.) and has animation support (which is still costly even when off due to the way the code is structured).

## Documentation

As we near an initial release we will add additional documentation. For now, please see the docs directory.

### Examples

Examples are available here: https://chartjs.github.io/chartjs-chart-financial/

### Date Libraries & IE Support

IE may not be supported because we use some newer ES features. We will need to apply Babel to fix this

Chart.js requires that you supply a date library. The examples utilize [chartjs-adapter-luxon](https://github.com/chartjs/chartjs-adapter-luxon), which has the best support for i18n and time zones. However, in order to use [Luxon](http://moment.github.io/luxon/) with IE you need to supply polyfills. If you require IE support you may find it easier to use another date library like [Moment](https://momentjs.com/) or [date-fns](https://date-fns.org/). Please see the Chart.js documentation for more details on date adapters.

## Related Plugins

The plugins below may be particularly interesting to use with financial charts. See [the Chart.js plugin API](https://www.chartjs.org/docs/latest/developers/plugins.html) and [longer list of plugins](https://www.chartjs.org/docs/latest/notes/extensions.html#plugins) for more info about Chart.js plugins generally.

- [chartjs-plugin-zoom](https://github.com/chartjs/chartjs-plugin-zoom)
- [chartjs-plugin-crosshair](https://github.com/abelheinsbroek/chartjs-plugin-crosshair) ([demo](https://www.abelheinsbroek.nl/financial/))
- [chartjs-plugin-streaming](https://github.com/nagix/chartjs-plugin-streaming) ([demo](https://nagix.github.io/chartjs-plugin-streaming/master/samples/integration/financial.html))

## Building

<a href="https://travis-ci.org/chartjs/chartjs-chart-financial"><img src="https://img.shields.io/travis/chartjs/chartjs-chart-financial.svg?style=flat-square&maxAge=600" alt="Builds"></a>

```sh
npm install
gulp build
```
