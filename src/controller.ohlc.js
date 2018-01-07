'use strict';

var helpers = Chart.helpers;

module.exports = function(Chart) {
	Chart.defaults.ohlc = Chart.defaults.financial;
	Chart.controllers.ohlc = Chart.controllers.financial.extend({
		dataElementType: Chart.elements.ohlc,
	});
};
