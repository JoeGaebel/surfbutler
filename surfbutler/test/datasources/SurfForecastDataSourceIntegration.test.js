const { getBeachData } = require('../../src/datasources/SurfForecastDataSource');

describe('SurfForecastDataSource', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('gets the data', async () => {
        const beachData = await getBeachData('Curl Curl');

        expect(beachData.rating).toBeFinite();
        expect(beachData.dataSource).toEqual('surfforecast');
    });
});