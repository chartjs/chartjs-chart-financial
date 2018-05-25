describe('Candlestick element tests', function() {

	it('Should be constructed', function() {
		var candle = new Chart.elements.Candlestick({
			_datasetIndex: 2,
			_index: 1
		});

		expect(candle).not.toBe(undefined);
		expect(candle._datasetIndex).toBe(2);
		expect(candle._index).toBe(1);
	});
   
	it('Should correctly identify as in range', function() {
		var candle = new Chart.elements.Candlestick({
			_datasetIndex: 2,
			_index: 1
		});

		candle._view = {
			base: 150,
			x: 10,
			y: 150,
			width: 50,
			candleOpen: 180,
			candleHigh: 100,
			candleLow: 200,
			candleClose: 120,
		};

		expect(candle.inRange(10, 130)).toBe(true);
		expect(candle.inRange(10, 190)).toBe(true);
		expect(candle.inRange(10, 80)).toBe(false);
		expect(candle.inRange(5, 400)).toBe(false);
	});

});
