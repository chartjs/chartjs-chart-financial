describe('FinancialLinear Scale', function () {

    it('Should register the constructor with the scale service', function () {
        var Constructor = Chart.scaleService.getScaleConstructor('financialLinear');
        expect(Constructor).not.toBe(undefined);
        expect(typeof Constructor).toBe('function');
    });

    it('Should have the correct min/max values', function () {
        var chart = window.acquireChart({
            type: 'financial',
            data: {
                datasets: [{
                    yAxisID: 'yScale0',
                    data: [
                        { t: 'April 01 2017', o: 70, h: 100, l: 30, c: 50. },
                        { t: 'April 02 2017', o: 60, h: 200, l: 40, c: 90 },
                    ]
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        id: 'yScale0',
                        type: 'financialLinear'
                    }]
                }
            }
        });

        expect(chart.scales.yScale0.max).toBe(220);
        expect(chart.scales.yScale0.min).toBe(20);
        
    });

});
