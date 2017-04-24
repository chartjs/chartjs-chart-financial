var Chart = require('chart.js');
Chart = typeof(Chart) === 'function' ? Chart : window.Chart;

require('./element.candlestick.js')(Chart);
require('./scale.financialCategory.js')(Chart);
require('./scale.financialLinear.js')(Chart);
require('./controller.financial.js')(Chart);
