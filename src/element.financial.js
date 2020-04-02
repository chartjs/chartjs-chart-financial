'use strict';

import Chart from 'chart.js';

const helpers = Chart.helpers;
const globalOpts = Chart.defaults.global;

globalOpts.elements.financial = {
	color: {
		up: 'rgba(80, 160, 115, 1)',
		down: 'rgba(215, 85, 65, 1)',
		unchanged: 'rgba(90, 90, 90, 1)',
	}
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
	const vm = candle._view;

	const halfWidth = vm.width / 2;
	const x1 = vm.x - halfWidth;
	const x2 = vm.x + halfWidth;
	const y1 = vm.candleHigh;
	const y2 = vm.candleLow;

	return {
		left: x1,
		top: y1,
		right: x2,
		bottom: y2
	};
}

const FinancialElement = Chart.Element.extend({

	height() {
		const vm = this._view;
		return vm.base - vm.y;
	},
	inRange(mouseX, mouseY) {
		let inRange = false;

		if (this._view) {
			const bounds = getBarBounds(this);
			inRange = mouseX >= bounds.left && mouseX <= bounds.right && mouseY >= bounds.top && mouseY <= bounds.bottom;
		}

		return inRange;
	},
	inLabelRange(mouseX, mouseY) {
		const me = this;
		if (!me._view) {
			return false;
		}

		let inRange = false;
		const bounds = getBarBounds(me);

		if (isVertical(me)) {
			inRange = mouseX >= bounds.left && mouseX <= bounds.right;
		} else {
			inRange = mouseY >= bounds.top && mouseY <= bounds.bottom;
		}

		return inRange;
	},
	inXRange(mouseX) {
		const bounds = getBarBounds(this);
		return mouseX >= bounds.left && mouseX <= bounds.right;
	},
	inYRange(mouseY) {
		const bounds = getBarBounds(this);
		return mouseY >= bounds.top && mouseY <= bounds.bottom;
	},
	getCenterPoint() {
		const vm = this._view;
		return {
			x: vm.x,
			y: (vm.candleHigh + vm.candleLow) / 2
		};
	},
	getArea() {
		const vm = this._view;
		return vm.width * Math.abs(vm.y - vm.base);
	},
	tooltipPosition() {
		const vm = this._view;
		return {
			x: vm.x,
			y: (vm.candleOpen + vm.candleClose) / 2
		};
	},
	hasValue() {
		const model = this._model;
		return helpers.isNumber(model.x) &&
			helpers.isNumber(model.candleOpen) &&
			helpers.isNumber(model.candleHigh) &&
			helpers.isNumber(model.candleLow) &&
			helpers.isNumber(model.candleClose);
	}
});

export default FinancialElement;
