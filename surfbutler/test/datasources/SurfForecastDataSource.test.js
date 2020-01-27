const rp = require('request-promise');
const { generateFixture } = require('./surfForecastFixtureGenerator');
const { getBeachData } = require('../../src/datasources/SurfForecastDataSource');

jest.mock('request-promise');

describe('SurfForecastDataSource', () => {
    it.each`
            spotName | urlPart
    ${ 'Dee Why' }   | ${ 'Dee-Why-Point' }
    ${ 'Curl Curl' } | ${ 'Curl-Curl' }
    ${ 'Freshwater' }| ${ 'Freshwater' }
    ${ 'Manly' }     | ${ 'Manly' }
    ${ 'Bondi' }     | ${ 'Bondi-Beach' }
    ${ 'Tamarama' }  | ${ 'Tamarama-Reef' }
    ${ 'Bronte' }    | ${ 'Bronte-Beach' }
    `('requests the correct url for $spotName', ({ spotName, urlPart }) => {
        const fakeResponse = generateFixture(3);
        rp.mockResolvedValue(fakeResponse);

        getBeachData(spotName);

        expect(rp).toHaveBeenCalledWith(`https://www.surf-forecast.com/breaks/${ urlPart }/forecasts/data?&parts=all&period_types=t,h&forecast_duration=48h`);
    });

    it('returns a NaN starred rating when the rating is not found', async () => {
        console.error = jest.fn();

        rp.mockResolvedValue(JSON.stringify({}));
        const beachData = await getBeachData('Bondi');
        expect(beachData.rating).toEqual(NaN);
        expect(console.error).toHaveBeenCalled();
    });

    it('returns the rating divided by 2', async () => {
        const fakeResponse = generateFixture(10);
        rp.mockResolvedValue(fakeResponse);

        const beachData = await getBeachData('Bondi');
        expect(beachData.rating).toEqual(5);
    });

    it('returns the correct number of decimal places', async () => {
        const fakeResponse = generateFixture(5);
        rp.mockResolvedValue(fakeResponse);

        const beachData = await getBeachData('Bondi');
        expect(beachData.rating).toEqual(2.5);
    });
});