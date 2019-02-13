'use strict';

module.exports = function(Chart) {

	var helpers = Chart.helpers;
	var globalOpts = Chart.defaults.global;

	globalOpts.elements.financial = {
		color: {
			up: 'rgba(80, 160, 115, 1)',
			down: 'rgba(215, 85, 65, 1)',
			unchanged: 'rgba(90, 90, 90, 1)',
		},
		fractionalDigitsCount: undefined,
	};

	function isVertical(bar) {
		return bar._view.width !== undefined;
	}

	/**
	 * Helper function to get the bounds of the candle
	 * @private
	 * @param bar {Chart.Element.financial} the bar
	 * @return {Bounds} bounds of the bar
	 */
	function getBarBounds(candle) {
		var vm = candle._view;
		var x1, x2, y1, y2;

		var halfWidth = vm.width / 2;
		x1 = vm.x - halfWidth;
		x2 = vm.x + halfWidth;
		y1 = vm.candleHigh;
		y2 = vm.candleLow;


		return {
			left: x1,
			top: y1,
			right: x2,
			bottom: y2
		};
	}

	Chart.elements.Financial = Chart.Element.extend({

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
			return {
				x: vm.x,
				y: (vm.candleHigh + vm.candleLow) / 2
			};
		},
		getArea: function() {
			var vm = this._view;
			return vm.width * Math.abs(vm.y - vm.base);
		},
		tooltipPosition: function() {
			var vm = this._view;
			return {
				x: vm.x,
				y: (vm.candleOpen + vm.candleClose) / 2
			};
		},
		hasValue: function() {
			var model = this._model;
			return helpers.isNumber(model.x) &&
				helpers.isNumber(model.candleOpen) &&
				helpers.isNumber(model.candleHigh) &&
				helpers.isNumber(model.candleLow) &&
				helpers.isNumber(model.candleClose);
		}
	});

};

