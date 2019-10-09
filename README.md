# Chart.js Financial Charting

Chart.js module for Candlestick and OHLC charts

## Roadmap

This module has not yet had its initial release and is not yet available on npm. This library depends on Chart.js and we are currently adding support for some of the necessary features there

Chart.js 2.7.0 added our timeseries scale as new option called [`distribution: series`](http://www.chartjs.org/docs/latest/axes/cartesian/time.html). This has greatly improved support for financial timeseries.

Chart.js 2.7.1 added [fixes for timeseries](https://github.com/chartjs/Chart.js/pull/4779).

Chart.js 2.7.2 added [formatting of timestamps in tooltips](https://github.com/chartjs/Chart.js/pull/5095).

Chart.js 2.7.3 included a [fix for hovering](https://github.com/chartjs/Chart.js/pull/5570).

Chart.js 2.8.0 added datetime adapters and [time scale performance improvements](https://github.com/chartjs/Chart.js/pull/6019). This allows users to use a datetime library of their choosing such as [Luxon](https://moment.github.io/luxon/) in order to get i18n and timezone support

Chart.js 2.9.0 will add [support for floating bars](https://github.com/chartjs/Chart.js/issues/4863), [better support for mixed chart types](https://github.com/chartjs/Chart.js/pull/5999), and numerous performance improvements ([#6301](https://github.com/chartjs/Chart.js/pull/6301), [#6304](https://github.com/chartjs/Chart.js/pull/6304), [#6307](https://github.com/chartjs/Chart.js/pull/6307)).

We would like to add [improved autoskipping](https://github.com/chartjs/Chart.js/pull/6274) and sharper drawing before having an initial release. The current work is centered around providing this infrastructure in the core Chart.js library. While there is not much activity in this repo, there is ongoing active development towards improved financial charting!

## Comparison

We are aiming to make Chart.js the only popular JavaScript library that is both performant and has good timescale handling.

Most chart libraries don't have great handling of timescale axes. Chart.js 2.9.0 will be the best library available in this regard by utilizing the concept of major ticks. E.g. it will make sure that the first day of each month is plotted before plotting days in between.

One of the best libraries we've found for financial charts is [react-stockcharts](https://github.com/rrag/react-stockcharts). However, it ties the user to utilizing React. Currently this library and react-stock charts are the same speed. However, we expect this library should be much faster after Chart.js 2.9.0 is released.

Because Chart.js utilizes canvas it is more performant than the majority of JavaScript charting libraries. [ZingChart](https://www.zingchart.com/docs/chart-types/stock-charts/) and [Highcharts](https://www.highcharts.com/stock/demo/candlestick) with the [boost module](https://www.highcharts.com/blog/news/175-highcharts-performance-boost/) are two options that also offer canvas rendering and may be performant.

## Documentation

As we near an initial release we will add additional documentation. For now, please see the docs directory.

### Examples

Examples are available here: https://chartjs.github.io/chartjs-chart-financial/

### Date Libraries & IE Support

Chart.js requires that you supply a date library. The examples utilize [chartjs-adapter-luxon](https://github.com/chartjs/chartjs-adapter-luxon), which has the best support for i18n and time zones. However, in order to use [Luxon](http://moment.github.io/luxon/) with IE you need to supply polyfills. If you require IE support you may find it easier to use another date library like [Moment](https://momentjs.com/) or [date-fns](https://date-fns.org/). Please see the Chart.js documentation for more details on date adapters.

## Related Plugins

The plugins below may be particularly interesting to use with financial charts. See [the Chart.js plugin API](https://www.chartjs.org/docs/latest/developers/plugins.html) and [longer list of plugins](https://www.chartjs.org/docs/latest/notes/extensions.html#plugins) for more info about Chart.js plugins generally.

- [chartjs-plugin-zoom](https://github.com/chartjs/chartjs-plugin-zoom)
- [chartjs-plugin-crosshair](https://github.com/abelheinsbroek/chartjs-plugin-crosshair) ([demo](https://www.abelheinsbroek.nl/financial/))
- [chartjs-plugin-streaming](https://github.com/nagix/chartjs-plugin-streaming) ([demo](https://nagix.github.io/chartjs-plugin-streaming/samples/financial.html))

## Building

<a href="https://travis-ci.org/chartjs/chartjs-chart-financial"><img src="https://img.shields.io/travis/chartjs/chartjs-chart-financial.svg?style=flat-square&maxAge=600" alt="Builds"></a>

```sh
npm install
gulp build
```
