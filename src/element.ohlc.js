'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalOpts = Chart.defaults.global;
	var defaultColor = globalOpts.defaultColor;

	globalOpts.elements.ohlc = {
		lineWidth: 2,
		armLength: 6,
		color: {
			up: globalOpts.elements.candlestick.upCandleColor,
			middle: '#888',
			down: globalOpts.elements.candlestick.downCandleColor,
		}
	};
	
	Chart.elements.ohlc = Chart.elements.Candlestick.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;
			var left, right, top, bottom, signX, signY, borderSkipped;
			var borderWidth = vm.borderWidth;

			var x = vm.x;
			var o = vm.candle.o;
			var h = vm.candle.h;
			var l = vm.candle.l;
			var c = vm.candle.c;
			var armLength = helpers.getValueOrDefault(vm.armLength, globalOpts.elements.ohlc.armLength);

			if (c < o) {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color?vm.color.up:undefined, globalOpts.elements.ohlc.color.up);
			} else if (c > o) {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color?vm.color.down:undefined, globalOpts.elements.ohlc.color.down);
			} else {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color?vm.color.middle:undefined, globalOpts.elements.ohlc.color.middle);
			}
			ctx.lineWidth = helpers.getValueOrDefault(vm.lineWidth, globalOpts.elements.ohlc.lineWidth);

			ctx.beginPath();
			ctx.moveTo(x, h);
			ctx.lineTo(x, l);
			ctx.moveTo(x-armLength, o);
			ctx.lineTo(x, o);
			ctx.moveTo(x+armLength, c);
			ctx.lineTo(x, c);
			ctx.stroke();
		},
	});
};

