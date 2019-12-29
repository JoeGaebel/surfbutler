const { getBeachData } = require('../../src/datasources/MagicSeaWeedDataSource');
const { generateFixture } = require('./magicSeaWeedFixtureGenerator');
const rp = require('request-promise');

jest.mock('request-promise');

describe('MagicSeaWeedDataSource', () => {
    describe('getBeachData#rating', () => {
        beforeEach(() => {
            const fixture = generateFixture();
            rp.mockReturnValue(Promise.resolve(fixture));
        });

        it('returns the rating for tomorrow at 6am', async () => {
            const { rating } = await getBeachData('some spot name');
            expect(rating).toEqual({
                string: '★★☆',
                meta: {
                    activeStars: 2,
                    inactiveStars: 1
                }
            });
        });
    });

    describe('MSW Urls', () => {
        const mswURLs = {
            'Dee Why': 'https://magicseaweed.com/Dee-Why-Point-Surf-Report/999/',
            'Curl Curl': 'https://magicseaweed.com/Curl-Curl-Surf-Report/1000/',
            'Freshwater': 'https://magicseaweed.com/Freshwater-Surf-Report/4997/',
            'Manly': 'https://magicseaweed.com/Sydney-Manly-Surf-Report/526/',
            'Bondi': 'https://magicseaweed.com/Sydney-Bondi-Surf-Report/996/',
            'Tamarama': 'https://magicseaweed.com/Tamarama-Beach-Surf-Report/5402/',
            'Bronte': 'https://magicseaweed.com/Bronte-Beach-Surf-Report/4579/',
        };

        beforeEach(() => {
            beforeEach(() => {
                rp.mockReturnValue(Promise.resolve(''));
            });
        });

        it.each([
            'Dee Why',
            'Curl Curl',
            'Freshwater',
            'Manly',
            'Bondi',
            'Tamarama',
            'Bronte'
        ])('gets uses the right MSW url for %p', async (beach) => {
            rp.mockReset();
            await getBeachData(beach);
            expect(rp).toHaveBeenCalledWith(mswURLs[beach]);
        });
    });

    describe('getBeachData#wave and swell data', () => {
        it('returns the correct beach data ', async () => {
            const fixture = generateFixture();
            rp.mockReturnValue(Promise.resolve(fixture));

            const beachData = await getBeachData('some spot name');

            expect(beachData.waveHeightInFeet).toEqual(2.5);
            expect(beachData.swellHeightInFeet).toEqual(6.5);
            expect(beachData.swellPeriod).toEqual(8);
            expect(beachData.name).toEqual('some spot name');
            expect(beachData.windSpeedInKnots).toEqual(12);
            expect(beachData.dataSource).toEqual('msw');
        });

        describe('when the wave height is a single number', () => {
            beforeEach(() => {
                const fixture = generateFixture({ withSingleWaveHeight: true });
                rp.mockReturnValue(Promise.resolve(fixture));
            });

            it('returns that height', async () => {
                const beachData = await getBeachData('some spot name');
                expect(beachData.waveHeightInFeet).toEqual(2);
            });
        });
    });
});