# Chart.js Financial Charting

Chart.js module for charting financial securities

Currently supports the Candlestick element. Pull requests are welcomed to add support for the OHLC element

## Usage and Roadmap

This module has not yet had its initial release and is not yet available on npm

Chart.js 2.7.0 added our [timeseries scale](https://github.com/chartjs/Chart.js/issues/4189) as new option called [`distribution: series`](http://www.chartjs.org/docs/latest/axes/cartesian/time.html). This has greatly improved support for financial timeseries.

We would like to add better tick/label generation before having an initial release.

As we near an initial release we will add documentation. For now, please see the samples directory.

## Comparison

Because Chart.js utilizes canvas it is more performant than the majority of JavaScript charting libraries. [ZingChart](https://www.zingchart.com/docs/chart-types/stock-charts/) and [Highcharts](https://www.highcharts.com/stock/demo/candlestick) with the [boost module](https://www.highcharts.com/blog/news/175-highcharts-performance-boost/) are two options that also offer canvas rendering and may be performant.

Most chart libraries don't have great handling of timescale axes. [AmCharts](https://www.amcharts.com/stock-chart/) is one exception to this.

We are aiming to make Chart.js the only popular JavaScript library that is both performant and has good timescale handling.

## Building

```sh
npm install
gulp
```
