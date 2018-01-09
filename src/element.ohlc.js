'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalOpts = Chart.defaults.global;

	globalOpts.elements.ohlc = {
		lineWidth: 2,
		armLength: null,
		armLengthRatio: 0.90,
		color: {
			up: globalOpts.elements.candlestick.upCandleColor,
			linear: '#888',
			down: globalOpts.elements.candlestick.downCandleColor,
		}
	};
	
	Chart.elements.ohlc = Chart.elements.Candlestick.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			var x = vm.x;
			var o = vm.candle.o;
			var h = vm.candle.h;
			var l = vm.candle.l;
			var c = vm.candle.c;
			var armLength = helpers.getValueOrDefault(vm.armLength, globalOpts.elements.ohlc.armLength);
			var armLengthRatio = helpers.getValueOrDefault(vm.armLengthRatio, globalOpts.elements.ohlc.armLengthRatio);
			if(armLength === null) {
				armLength = vm.width * 0.7 * armLengthRatio;
			}

			if (c < o) {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color?vm.color.up:undefined, globalOpts.elements.ohlc.color.up);
			} else if (c > o) {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color?vm.color.down:undefined, globalOpts.elements.ohlc.color.down);
			} else {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color?vm.color.linear:undefined, globalOpts.elements.ohlc.color.linear);
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
