'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalOpts = Chart.defaults.global;

	globalOpts.elements.ohlc = Object.assign(globalOpts.elements.financial, {
		lineWidth: 2,
		armLength: null,
		armLengthRatio: 0.8,
	});

	Chart.elements.Ohlc = Chart.elements.Financial.extend({
		draw: function() {
			var ctx = this._chart.ctx;
			var vm = this._view;

			var x = vm.x;
			var o = vm.candleOpen;
			var h = vm.candleHigh;
			var l = vm.candleLow;
			var c = vm.candleClose;
			var armLength = helpers.getValueOrDefault(vm.armLength, globalOpts.elements.ohlc.armLength);
			var armLengthRatio = helpers.getValueOrDefault(vm.armLengthRatio, globalOpts.elements.ohlc.armLengthRatio);
			if (armLength === null) {
				// The width of an ohlc is affected by barPercentage and categoryPercentage
				// This behavior is caused by extending controller.financial, which extends controller.bar
				// barPercentage and categoryPercentage are now set to 1.0 (see controller.ohlc)
				// and armLengthRatio is multipled by 0.5,
				// so that when armLengthRatio=1.0, the arms from neighbour ohcl touch,
				// and when armLengthRatio=0.0, ohcl are just vertical lines.
				armLength = vm.width * armLengthRatio * 0.5;
			}

			if (c < o) {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color ? vm.color.up : undefined, globalOpts.elements.ohlc.color.up);
			} else if (c > o) {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color ? vm.color.down : undefined, globalOpts.elements.ohlc.color.down);
			} else {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color ? vm.color.unchanged : undefined, globalOpts.elements.ohlc.color.unchanged);
			}
			ctx.lineWidth = helpers.getValueOrDefault(vm.lineWidth, globalOpts.elements.ohlc.lineWidth);

			ctx.beginPath();
			ctx.moveTo(x, h);
			ctx.lineTo(x, l);
			ctx.moveTo(x - armLength, o);
			ctx.lineTo(x, o);
			ctx.moveTo(x + armLength, c);
			ctx.lineTo(x, c);
			ctx.stroke();
		},
	});
};
