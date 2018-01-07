'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers,
		globalOpts = Chart.defaults.global,
		defaultColor = globalOpts.defaultColor;

	globalOpts.elements.ohlc = {
		lineWidth: 2,
		armLength: 6,
		color: {
			up: globalOpts.elements.candlestick.upCandleColor,
			middle: '#888',
			down: globalOpts.elements.candlestick.downCandleColor,
		}
	};

	function isVertical(bar) {
		return bar._view.width !== undefined;
	}

	/**
	 * Helper function to get the bounds of the candle
	 * @private
	 * @param bar {Chart.Element.Candlestick} the bar
	 * @return {Bounds} bounds of the bar
	 */
	function getBarBounds(candle) {
		var vm = candle._view;
		var x1, x2, y1, y2;
		var halfWidth = vm.width / 2;
		x1 = vm.x - halfWidth;
		x2 = vm.x + halfWidth;
		y1 = vm.candle.h;
		y2 = vm.candle.l;
		return {
			left: x1,
			top: y1,
			right: x2,
			bottom: y2
		};
	}

	Chart.elements.ohlc = Chart.Element.extend({
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
			var arm = helpers.getValueOrDefault(vm.armLength, globalOpts.elements.ohlc.armLength);
			var color = vm.candle.color;

			if (c < o) {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color?vm.color.up:undefined, globalOpts.elements.ohlc.color.up);
			} else if (c > o) {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color?vm.color.down:undefined, globalOpts.elements.ohlc.color.down);
			} else {
				ctx.strokeStyle = helpers.getValueOrDefault(vm.color?vm.color.middle:undefined, globalOpts.elements.ohlc.color.middle);
			}
			ctx.strokeStyle = helpers.getValueOrDefault(color, ctx.strokeStyle);
			ctx.lineWidth = helpers.getValueOrDefault(vm.lineWidth, globalOpts.elements.ohlc.lineWidth);

			ctx.beginPath();
			ctx.moveTo(x, h);
			ctx.lineTo(x, l);
			ctx.moveTo(x-arm, o);
			ctx.lineTo(x, o);
			ctx.moveTo(x+arm, c);
			ctx.lineTo(x, c);
			ctx.stroke();
		},
		height: function() {
			var vm = this._view;
			return vm.base - vm.y;
		},
		inRange: function(mouseX, mouseY) {
			var inRange = false;

			if (this._view) {
				var bounds = getBarBounds(this);
				inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inLabelRange: function(mouseX, mouseY) {
			var me = this;
			if (!me._view) {
				return false;
			}

			var inRange = false;
			var bounds = getBarBounds(me);

			if (isVertical(me)) {
				inRange = mouseX >= bounds.left && mouseX <= bounds.right;
			} else {
				inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
			}

			return inRange;
		},
		inXRange: function(mouseX) {
			var bounds = getBarBounds(this);
			return mouseX >= bounds.left && mouseX <= bounds.right;
		},
		inYRange: function(mouseY) {
			var bounds = getBarBounds(this);
			return mouseY >= bounds.top && mouseY <= bounds.bottom;
		},
		getCenterPoint: function() {
			var vm = this._view;
			var x, y;

			var halfWidth = vm.width / 2;
			x = vm.x - halfWidth;
			y = (vm.candle.h + vm.candle.l) / 2;

			return { x: x, y: y };
		},
		getArea: function() {
			var vm = this._view;
			return vm.width * Math.abs(vm.y - vm.base);
		},
		tooltipPosition: function() {
			var vm = this._view;
			return {
				x: vm.x,
				y: (vm.candle.h + vm.candle.l) / 2
			};
		}
	});

};

