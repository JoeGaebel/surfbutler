const { getBeachData } = require('../../src/datasources/MagicSeaWeedDataSource');

describe('MagicSeaWeedDataSource', () => {
    it('gets the data', async () => {
        const beachData = await getBeachData('Bondi');

        expect(beachData.rating.string).toMatch(/[★|☆]+/);
        expect(beachData.waveHeightInFeet).toBeFinite();
        expect(beachData.swellHeightInFeet).toBeFinite();
        expect(beachData.swellPeriod).toBeFinite();
        expect(beachData.windSpeedInKnots).toBeFinite();
    });
});