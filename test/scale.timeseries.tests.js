describe('Timeseries Scale', function () {

    it('Should register the constructor with the scale service', function () {
        var Constructor = Chart.scaleService.getScaleConstructor('timeseries');
        expect(Constructor).not.toBe(undefined);
        expect(typeof Constructor).toBe('function');
    });

});
