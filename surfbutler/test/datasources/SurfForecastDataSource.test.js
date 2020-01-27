const rp = require('request-promise');
const { getBeachData } = require('../../src/datasources/SurfForecastDataSource');

jest.mock('request-promise');

describe('SurfForecaΩstDataSource', () => {
    beforeEach(() => {
        const fakeResponse = { period_types: { t: { parts: { basic: { content: '<tbody></tbody>' } } } } };
        rp.mockResolvedValue(JSON.stringify(fakeResponse));
    });

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
        getBeachData(spotName);

        expect(rp).toHaveBeenCalledWith(`https://www.surf-forecast.com/breaks/${ urlPart }/forecasts/data?&parts=all&period_types=t,h&forecast_duration=48h`);
    });

    it('returns a NaN starred rating when the rating is not found', async () => {
        const beachData = await getBeachData('Bondi');
        expect(beachData.rating.meta.stars).toBeNaN();
    });
});