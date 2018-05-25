var candleCount = 60;
var data = getRandomData('April 01 2017', candleCount);

// Candlestick
var ctx = document.getElementById("chart1").getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 250;
var candlestickChart = new Chart(ctx, {
	type: 'candlestick',
	data: {
		datasets: [{
			label: "CHRT - Chart.js Corporation",
			data: data
		}]
	}
});

// OHLC
var ctx2 = document.getElementById("chart2").getContext("2d");
ctx2.canvas.width = 1000;
ctx2.canvas.height = 250;
var ohlcChart = new Chart(ctx2, {
	type: 'ohlc',
	data: {
		datasets: [{
			label: "CHRTO - Chart.js Corporation, OHLC division",
			data: data
		}]
	}
});

var getRandomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

document.getElementById('randomizeData').addEventListener('click', function() {
	candlestickChart.data.datasets.forEach(function(dataset) {
		dataset.data = getRandomData('April 01 2017', candleCount + getRandomInt(10));
	});
	candlestickChart.update();

	ohlcChart.data.datasets.forEach(function(dataset) {
		dataset.data = getRandomData('April 01 2017', candleCount + getRandomInt(10));
	});
	ohlcChart.update();
});