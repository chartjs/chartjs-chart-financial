# Chart.js Financial Charting

Chart.js module for charting financial securities

Currently supports the Candlestick element. Pull requests are welcomed to add support for the OHLC element

## Usage

This module has not yet had its initial release and is not yet available on npm

We are currently working on improving the main Chart.js library's [time support](https://github.com/chartjs/Chart.js/issues/4187) and contributing our [timeseries scale](https://github.com/chartjs/Chart.js/issues/4189) to Chart.js. We are aiming to have those improvements be a part of Chart.js 2.7.0 at which point we will hopefully have our initial release.

As we near an initial release we will add documentation. For now, please see the samples directory

## Comparison

Because Chart.js utilizes canvas it is more performant than the majority of JavaScript charting libraries. [ZingChart](https://www.zingchart.com/docs/chart-types/stock-charts/) and [Highcharts](https://www.highcharts.com/stock/demo/candlestick) with the [boost module](https://www.highcharts.com/blog/news/175-highcharts-performance-boost/) are two options that may also be performant.

Most chart libraries don't have great handling of timescale axes. [AmCharts](https://www.amcharts.com/stock-chart/) is one exception to this.

Chart.js will be the only popular JavaScript library that is both performant and has good timescale handling once the issues above are completed.

## Building

```sh
npm install
gulp
```
