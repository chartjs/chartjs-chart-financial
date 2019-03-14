var barCount = 60;
var initialDateStr = '01 Apr 2017 00:00 Z';
var data = getRandomData(initialDateStr, barCount);

var ctx = document.getElementById("chart").getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 250;
var chart = new Chart(ctx, {
	type: 'candlestick',
	data: {
		datasets: [{
			label: "CHRT - Chart.js Corporation",
			data: data
		}]
	}
});

var getRandomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max));
};

var update = function() {
	var dataset = chart.config.data.datasets[0];

	// candlestick vs ohlc
	var type = document.getElementById('type').value;
	dataset.type = type;

	// color
	var colorScheme = document.getElementById('color-scheme').value;
	if (colorScheme === 'neon') {
		dataset.color = {
			up: '#01ff01',
			down: '#fe0000',
			unchanged: '#999',
		};
	} else {
		delete dataset.color;
	}

	// border
	var border = document.getElementById('border').value;
	if (border === 'true') {
		dataset.borderColor = '#000';
		dataset.borderWidth = 2;
	} else {
		delete dataset.borderColor;
		delete dataset.borderWidth;
	}

	chart.update();
};

document.getElementById('update').addEventListener('click', update);

document.getElementById('randomizeData').addEventListener('click', function() {
	chart.data.datasets.forEach(function(dataset) {
		dataset.data = getRandomData(initialDateStr, barCount + getRandomInt(10));
	});
	update();
});
