'use strict';

import Chart from 'chart.js';
import FinancialElement from './element.financial';

const helpers = Chart.helpers;
const globalOpts = Chart.defaults.global;

globalOpts.elements.ohlc = helpers.merge({}, [globalOpts.elements.financial, {
	lineWidth: 2,
	armLength: null,
	armLengthRatio: 0.8,
}]);

const OhlcElement = FinancialElement.extend({
	draw() {
		const ctx = this._chart.ctx;
		const vm = this._view;

		const x = vm.x;
		const o = vm.candleOpen;
		const h = vm.candleHigh;
		const l = vm.candleLow;
		const c = vm.candleClose;
		const armLengthRatio = helpers.getValueOrDefault(vm.armLengthRatio, globalOpts.elements.ohlc.armLengthRatio);
		let armLength = helpers.getValueOrDefault(vm.armLength, globalOpts.elements.ohlc.armLength);
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
	}
});

export default OhlcElement;
