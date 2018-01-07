function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function randomBar(date, lastClose) {
	var open = randomNumber(lastClose * .95, lastClose * 1.05);
	var close = randomNumber(open * .95, open * 1.05);
	var high = randomNumber(Math.max(open, close), Math.max(open, close) * 1.1);
	var low = randomNumber(Math.min(open, close) * .9, Math.min(open, close));
	return {
		t: date.valueOf(),
		o: open,
		h: high,
		l: low,
		c: close,
	};
}

var dateFormat = 'MMMM DD YYYY';
var date = moment('April 01 2017', dateFormat);
var data = [randomBar(date, 30)];
while (data.length < 60) {
	date = date.clone().add(1, 'd');
	if (date.isoWeekday() <= 5) {
		data.push(randomBar(date, data[data.length - 1].c));
	}
}

var ctx = document.getElementById("chart1").getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 250;
new Chart(ctx, {
	type: 'financial',
	data: {
		datasets: [{
			label: "CHRT - Chart.js Corporation",
			data: data
		}]
	}
});


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


var ctx3 = document.getElementById("chart3").getContext("2d");
ctx3.canvas.width = 1000;
ctx3.canvas.height = 250;
new Chart(ctx3, {
	type: 'financial',
	data: {
		datasets: [{
			upCandleColor: "#11f",
			downCandleColor: "#fb8",
			outlineCandleColor: "#000",
			outlineCandleWidth: 2,
			label: "CHRT - Chart.js Corporation",
			data: data
		}]
	}
});


var ctx4 = document.getElementById("chart4").getContext("2d");
ctx4.canvas.width = 1000;
ctx4.canvas.height = 250;
new Chart(ctx4, {
	type: 'ohlc',
	data: {
		datasets: [{
			color: {
				up: '#11f',
				down: '#fb8',
				middle: '#000',
			},
			armLength: 8,
			lineWidth: 4,
			label: "CHRTO - Chart.js Corporation, OHLC division",
			data: data,
		}]
	}
});
