var data = getRandomData('April 01 2017', 60);

// Candlestick
var ctx = document.getElementById("chart1").getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 250;
new Chart(ctx, {
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
new Chart(ctx2, {
	type: 'ohlc',
	data: {
		datasets: [{
			label: "CHRTO - Chart.js Corporation, OHLC division",
			data: data
		}]
	}
});
