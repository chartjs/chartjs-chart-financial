const {ChartJSNodeCanvas} = require('chartjs-node-canvas');
const path = require('path');
const assert = require('assert').strict;

async function main() {
	const chartJSNodeCanvas = new ChartJSNodeCanvas({
		width: 400, height: 400, plugins: {
			globalVariableLegacy: [
				'chartjs-adapter-luxon',
				path.resolve(__dirname, '../dist/chartjs-chart-financial.js')
			]
		}
	});
	const data = await chartJSNodeCanvas.renderToBuffer({
		type: 'candlestick',
		data: {
			datasets: [{
				label: 'CHRT - Chart.js Corporation',
				data: [
					{
						x: 1491004800000,
						o: 29.18,
						h: 31.62,
						l: 28.99,
						c: 29.97
					},
					{
						x: 1491177600000,
						o: 30.8,
						h: 31.27,
						l: 29.11,
						c: 30.52
					},
					{
						x: 1491264000000,
						o: 30.16,
						h: 33.34,
						l: 28.84,
						c: 30.44
					}
				]
			}]
		}
	});
	assert.ok(Buffer.isBuffer(data));
}

main();
