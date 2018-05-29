'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalOpts = Chart.defaults.global;

	globalOpts.elements.candlestick = Object.assign(globalOpts.elements.financial, {
		border: {
			up: globalOpts.elements.financial.color.up,
			down: globalOpts.elements.financial.color.down,
			unchanged: globalOpts.elements.financial.color.unchanged
		},
		borderColor: globalOpts.elements.financial.color.unchanged,
		borderWidth: 1,
	});

	Chart.elements.Candlestick = Chart.elements.Financial.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			var x = vm.x;
			var o = vm.candleOpen;
			var h = vm.candleHigh;
			var l = vm.candleLow;
			var c = vm.candleClose;

			var borderColor;

			if (c < o) {
				borderColor = helpers.getValueOrDefault(vm.border ? vm.border.up : undefined, globalOpts.elements.candlestick.border.up);
				ctx.fillStyle = helpers.getValueOrDefault(vm.color ? vm.color.up : undefined, globalOpts.elements.candlestick.color.up);
			} else if (c > o) {
				borderColor = helpers.getValueOrDefault(vm.border ? vm.border.down : undefined, globalOpts.elements.candlestick.border.down);
				ctx.fillStyle = helpers.getValueOrDefault(vm.color ? vm.color.down : undefined, globalOpts.elements.candlestick.color.down);
			} else {
				borderColor = helpers.getValueOrDefault(vm.border ? vm.border.unchanged : undefined, globalOpts.elements.candlestick.border.unchanged);
				ctx.fillStyle = helpers.getValueOrDefault(vm.color ? vm.color.unchanged : undefined, globalOpts.elements.candlestick.color.unchanged);
			}

			ctx.lineWidth = helpers.getValueOrDefault(vm.borderWidth, globalOpts.elements.candlestick.borderWidth);
			ctx.strokeStyle = helpers.getValueOrDefault(borderColor, globalOpts.elements.candlestick.borderColor);

			ctx.beginPath();
			ctx.moveTo(x, h);
			ctx.lineTo(x, Math.min(o, c));
			ctx.moveTo(x, l);
			ctx.lineTo(x, Math.max(o, c));
			ctx.stroke();
			ctx.fillRect(x - vm.width / 2, c, vm.width, o - c);
			ctx.strokeRect(x - vm.width / 2, c, vm.width, o - c);
			ctx.closePath();
		},
	});
};
