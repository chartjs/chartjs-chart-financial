describe('Financial controller tests', function() {
	it('Should be constructed', function() {
		var chart = window.acquireChart({ type: 'candlestick',
			data: {
				datasets: [{
					data: []
				}]
			},
			getDatasetMeta: function(datasetIndex) {
				this.data.datasets[datasetIndex].meta = this.data.datasets[datasetIndex].meta || {
					data: [],
					dataset: null
				};
				return this.data.datasets[datasetIndex].meta;
			}
		});

		var controller = new Chart.controllers.financial(chart, 0);
		expect(controller).not.toBe(undefined);
		expect(controller.index).toBe(0);

		var meta = chart.getDatasetMeta(0);
		expect(meta.data).toEqual([]);

		controller.updateIndex(1);
		expect(controller.index).toBe(1);
	});

	it('Should create candlestick elements for each data item during initialization', function () {
		var chart = window.acquireChart({ type: 'candlestick',
			data: {
				datasets: [{
					data: [
						{t: '2017-04-01', o: 70.87, h: 80.13, l: 40.94, c: 50.24},
						{t: '2017-04-02', o: 60.23, h: 200.23, l: 50.29, c: 90.20},
						{t: '2017-04-03', o: 40.00, h: 50.42, l: 20.31, c: 30.20},
						{t: '2017-04-04', o: 60.90, h: 80.34, l: 40.14, c: 60.29},
						{t: '2017-04-05', o: 60.94, h: 100.09, l: 50.78, c: 90.04},
						{t: '2017-04-06', o: 30.49, h: 50.20, l: 20.09, c: 40.20},
						{t: '2017-04-07', o: 50.04, h: 80.93, l: 40.94, c: 70.24},
						{t: '2017-04-08', o: 60.29, h: 100.49, l: 50.49, c: 90.24},
						{t: '2017-04-09', o: 40.04, h: 50.23, l: 20.23, c: 30.49},
						{t: '2017-04-10', o: 30.23, h: 50.09, l: 20.87, c: 40.49}
					]
				}]
			},
			getDatasetMeta: function(datasetIndex) {
				this.data.datasets[datasetIndex].meta = this.data.datasets[datasetIndex].meta || {
					data: [],
					dataset: null
				};
				return this.data.datasets[datasetIndex].meta;
			}
		});

		new Chart.controllers.candlestick(chart, 0);
		var meta = chart.getDatasetMeta(0);
		expect(meta.data.length).toBe(10);
		for (var i = 0; i < meta.data.length; i++) {
			expect(meta.data[i] instanceof Chart.elements.Candlestick).toBe(true);
		}
	});

});
