function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function randomBar(date) {
	return {
		t: date.valueOf(),
		o: randomNumber(30, 40),
		h: randomNumber(40, 50),
		l: randomNumber(20, 30),
		c: randomNumber(30, 40)
	};
}

var dateFormat = 'MMMM DD YYYY';
var date = moment('April 01 2017', dateFormat);
var data = [randomBar(date)];
while (data.length < 60) {
	date = date.add(1, 'd');
	if (date.isoWeekday() <= 5) {
		data.push(randomBar(date));
	}
}

var ctx = document.getElementById("chart1").getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 300;
new Chart(ctx, {
	type: 'financial',
	data: {
		datasets: [{
			label: "NASDAQ: MSFT - Microsoft Corporation",
			data: data
		}]
	}
});
