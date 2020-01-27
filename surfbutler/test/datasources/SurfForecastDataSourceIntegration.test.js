const { getBeachData } = require('../../src/datasources/SurfForecastDataSource');

describe('SurfForecastDataSource', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('gets the data', async () => {
        const beachData = await getBeachData('Curl Curl');

        expect(beachData.rating.string).toMatch(/[★]+/);
        expect(beachData.dataSource).toEqual('surfforecast');
        expect(beachData.rating.meta).toEqual({ stars: expect.any(Number) });
    });
});