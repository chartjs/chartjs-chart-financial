'use strict';

var Chart = require('chart.js');
Chart = typeof Chart === 'function' ? Chart : window.Chart;

require('./scale.financialLinear.js')(Chart);

require('./element.financial.js')(Chart);
require('./element.candlestick.js')(Chart);
require('./element.ohlc.js')(Chart);

require('./controller.financial.js')(Chart);
require('./controller.candlestick.js')(Chart);
require('./controller.ohlc.js')(Chart);
