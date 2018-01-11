'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalOpts = Chart.defaults.global;

	globalOpts.elements.candlestick = Object.assign(globalOpts.elements.financial, {
		borderColor: globalOpts.elements.financial.color.unchanged,
		borderWidth: 1,
	});

	Chart.elements.Candlestick = Chart.elements.Financial.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			var x = vm.x;
			var o = vm.candle.o;
			var h = vm.candle.h;
			var l = vm.candle.l;
			var c = vm.candle.c;

			ctx.strokeStyle = helpers.getValueOrDefault(vm.borderColor, globalOpts.elements.candlestick.borderColor);
			ctx.lineWidth = helpers.getValueOrDefault(vm.borderWidth, globalOpts.elements.candlestick.borderWidth);
			if (c < o) {
				ctx.fillStyle = helpers.getValueOrDefault(vm.color ? vm.color.up : undefined, globalOpts.elements.candlestick.color.up);
			} else if (c > o) {
				ctx.fillStyle = helpers.getValueOrDefault(vm.color ? vm.color.down : undefined, globalOpts.elements.candlestick.color.down);
			} else {
				ctx.fillStyle = helpers.getValueOrDefault(vm.color ? vm.color.unchanged : undefined, globalOpts.elements.candlestick.color.unchanged);
			}

			ctx.beginPath();
			ctx.moveTo(x, h);
			ctx.lineTo(x, Math.min(o,c));
			ctx.moveTo(x, l);
			ctx.lineTo(x, Math.max(o,c));
			ctx.stroke();
			ctx.fillRect(x - vm.width / 2, c, vm.width, o - c);
			ctx.strokeRect(x - vm.width / 2, c, vm.width, o - c);
			ctx.closePath();
		},
	});
};
