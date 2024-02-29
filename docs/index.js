var barCount = 60;
var initialDateStr = new Date().toUTCString();

var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;

var barData = new Array(barCount);
var lineData = new Array(barCount);

getRandomData(initialDateStr);

var chart = new Chart(ctx, {
  type: 'candlestick',
  data: {
    datasets: [{
      label: 'CHRT - Chart.js Corporation',
      data: barData,
    }, {
      label: 'Close price',
      type: 'line',
      data: lineData,
      hidden: true,
    }]
  }
});

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function randomBar(target, index, date, lastClose) {
  var open = +randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
  var close = +randomNumber(open * 0.95, open * 1.05).toFixed(2);
  var high = +randomNumber(Math.max(open, close), Math.max(open, close) * 1.1).toFixed(2);
  var low = +randomNumber(Math.min(open, close) * 0.9, Math.min(open, close)).toFixed(2);

  if (!target[index]) {
    target[index] = {};
  }

  Object.assign(target[index], {
    x: date.valueOf(),
    o: open,
    h: high,
    l: low,
    c: close
  });

}

function getRandomData(dateStr) {
  var date = luxon.DateTime.fromRFC2822(dateStr);

  for (let i = 0; i < barData.length;) {
    date = date.plus({days: 1});
    if (date.weekday <= 5) {
      randomBar(barData, i, date, i === 0 ? 30 : barData[i - 1].c);
      lineData[i] = {x: barData[i].x, y: barData[i].c};
      i++;
    }
  }
}

var update = function() {
  var dataset = chart.config.data.datasets[0];

  // candlestick vs ohlc
  var type = document.getElementById('type').value;
  chart.config.type = type;

  // linear vs log
  var scaleType = document.getElementById('scale-type').value;
  chart.config.options.scales.y.type = scaleType;

  // color
  var colorScheme = document.getElementById('color-scheme').value;
  if (colorScheme === 'neon') {
    chart.config.data.datasets[0].backgroundColors = {
      up: '#01ff01',
      down: '#fe0000',
      unchanged: '#999',
    };
  } else {
    delete chart.config.data.datasets[0].backgroundColors;
  }

  // border
  var border = document.getElementById('border').value;
  if (border === 'false') {
    dataset.borderColors = 'rgba(0, 0, 0, 0)';
  } else {
    delete dataset.borderColors;
  }

  // mixed charts
  var mixed = document.getElementById('mixed').value;
  if (mixed === 'true') {
    chart.config.data.datasets[1].hidden = false;
  } else {
    chart.config.data.datasets[1].hidden = true;
  }

  chart.update();
};

[...document.getElementsByTagName('select')].forEach(element => element.addEventListener('change', update));

document.getElementById('update').addEventListener('click', update);

document.getElementById('randomizeData').addEventListener('click', function() {
  getRandomData(initialDateStr, barData);
  update();
});
