const { SurflineDataSource } = require('../../datasources/surflineDataSource');

describe('SurflineDataSource', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('returns summary data in a BeachData instance', async () => {
        const dataSource = new SurflineDataSource();
        const beachData = await dataSource.getBeachData('Bondi', '5842041f4e65fad6a7708bf8');

        expect(beachData.name).toEqual('Bondi');
        expect(beachData.rating).toEqual(undefined);
        expect(beachData.heightInFeet).toBeGreaterThanOrEqual(0);
        expect(beachData.swellHeight).toBeGreaterThanOrEqual(0);
        expect(beachData.period).toBeGreaterThanOrEqual(0);
        expect(beachData.swellDirection).toMatch(new RegExp('(⬅️|⬆️|➡️|⬇️|↙️|↖️|↗️|↘️)'));
        expect(beachData.weatherEmoji).toMatch(new RegExp('(☀️|🌤|⛅|☁️|🌦|🌧|✨)'));
        expect(beachData.temperature).toBeGreaterThanOrEqual(0);
        expect(beachData.sunriseTime).toMatch(new RegExp('^([0-1][0-9]|[2][0-3]):([0-5][0-9])$'));
        expect(beachData.windSpeed).toBeGreaterThanOrEqual(0);
        expect(beachData.windDirection).toMatch(new RegExp('(⬅️|⬆️|➡️|⬇️|↙️|↖️|↗️|↘️)'));
        expect(beachData.tideType).toMatch(new RegExp('(LOW|NORMAL|HIGH)'));
    });
});