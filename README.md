# Chart.js Financial Charting

Chart.js module for Candlestick and OHLC charts

## Usage and Roadmap

This module has not yet had its initial release and is not yet available on npm

Chart.js 2.7.0 added our [timeseries scale](https://github.com/chartjs/Chart.js/issues/4189) as new option called [`distribution: series`](http://www.chartjs.org/docs/latest/axes/cartesian/time.html). This has greatly improved support for financial timeseries.

Chart.js 2.7.1 added fixes for timeseries.

Chart.js 2.7.2 added timestamp formatting in tooltips.

The next release of Chart.js will include a [fix for hovering](https://github.com/chartjs/Chart.js/pull/5570).

We would like to add better tick/label generation when `source:data`, fixes for mixed chart types, [support for floating bars](https://github.com/chartjs/Chart.js/issues/4863), and timezone handling before having an initial release.

As we near an initial release we will add documentation. For now, please see the docs directory.

## Comparison

Because Chart.js utilizes canvas it is more performant than the majority of JavaScript charting libraries. [ZingChart](https://www.zingchart.com/docs/chart-types/stock-charts/) and [Highcharts](https://www.highcharts.com/stock/demo/candlestick) with the [boost module](https://www.highcharts.com/blog/news/175-highcharts-performance-boost/) are two options that also offer canvas rendering and may be performant.

Most chart libraries don't have great handling of timescale axes. [AmCharts](https://www.amcharts.com/stock-chart/) is one exception to this.

We are aiming to make Chart.js the only popular JavaScript library that is both performant and has good timescale handling.

## Building

```sh
npm install
gulp
```

## Examples

Out of the box examples are available here: https://chartjs.github.io/chartjs-chart-financial/
