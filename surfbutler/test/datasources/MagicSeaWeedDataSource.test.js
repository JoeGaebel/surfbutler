const { getBeachData } = require('../../src/datasources/MagicSeaWeedDataSource');
const { generateFixture } = require('./magicSeaWeedFixtureGenerator');
const rp = require('request-promise');
const { BeachData } = require('../../src/datasources/BeachData');

jest.mock('request-promise');

describe('MagicSeaWeedDataSource', () => {
    describe('getBeachData#rating', () => {
        it('treats a windy star as a half star', async () => {
            const fixture = generateFixture({ stars: { inactive: 1, active: 0 } });
            rp.mockReturnValue(Promise.resolve(fixture));

            const { rating } = await getBeachData('some spot name');
            expect(rating).toEqual(0.5);
        });

        it('handles 5 windy stars', async () => {
            const fixture = generateFixture({ stars: { active: 0, inactive: 5 } });
            rp.mockReturnValue(Promise.resolve(fixture));

            const { rating } = await getBeachData('some spot name');
            expect(rating).toEqual(2.5);
        });

        it('treats full stars as one unit', async () => {
            const fixture = generateFixture({ stars: { active: 5, inactive: 0 } });
            rp.mockReturnValue(Promise.resolve(fixture));

            const { rating } = await getBeachData('some spot name');
            expect(rating).toEqual(5);
        });

        it('blends the active and inactive stars', async () => {
            const fixture = generateFixture({ stars: { active: 3, inactive: 2 } });
            rp.mockReturnValue(Promise.resolve(fixture));

            const { rating } = await getBeachData('some spot name');
            expect(rating).toEqual(4);
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

    it('returns an empty beach data and console errors if it fails', async () => {
        console.error = jest.fn();
        rp.mockRejectedValue({});

        const fallbackBeachData = await getBeachData('some spot name');

        expect(console.error).toHaveBeenCalled();

        expect(fallbackBeachData).toEqual(new BeachData({
            rating: NaN,
            waveHeightInFeet: NaN,
            swellHeightInFeet: NaN,
            swellPeriod: NaN,
            name: 'some spot name',
            windSpeedInKnots: NaN,
            dataSource: 'msw'
        }));
    });
});