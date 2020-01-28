const { getBeachData } = require('../../src/datasources/SurflineDataSource');
const SurflineDataSource = require('rewire')('../../src/datasources/SurflineDataSource');
const { BeachData } = require('../../src/datasources/BeachData');

describe('SurflineDataSource', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('returns summary data in a BeachData instance', async () => {
        const beachData = await getBeachData('Bondi', '5842041f4e65fad6a7708bf8');

        expect(beachData.name).toEqual('Bondi');
        expect(beachData.rating).toEqual(undefined);
        expect(beachData.waveHeightInFeet).toBeGreaterThanOrEqual(0);
        expect(beachData.swellHeightInFeet).toBeGreaterThanOrEqual(0);
        expect(beachData.swellPeriod).toBeGreaterThanOrEqual(0);
        expect(beachData.swellDirectionEmoji).toMatch(new RegExp('(⬅️|⬆️|➡️|⬇️|↙️|↖️|↗️|↘️)'));
        expect(beachData.weatherEmoji).toMatch(new RegExp('(☀️|🌤|⛅|☁️|🌦|🌧|✨)'));
        expect(beachData.temperature).toBeGreaterThanOrEqual(0);
        expect(beachData.sunriseTime).toMatch(new RegExp('^([0-1][0-9]|[2][0-3]):([0-5][0-9])$'));
        expect(beachData.windSpeedInKnots).toBeGreaterThanOrEqual(0);
        expect(beachData.windDirectionEmoji).toMatch(new RegExp('(⬅️|⬆️|➡️|⬇️|↙️|↖️|↗️|↘️)'));
        expect(beachData.tideType).toMatch(new RegExp('(LOW|NORMAL|HIGH)'));
        expect(beachData.dataSource).toEqual('surfline');
    });

    describe('getSwell', () => {
        let getSwell;

        beforeEach(() => {
            getSwell = SurflineDataSource.__get__('getSwell');
        });

        it('getOptimalScore', () => {
            expect(getSwell([
                { direction: 2, height: 3, optimalScore: 1, period: 4 },
                { direction: 20, height: 30, optimalScore: 0, period: 40 }
            ])).toEqual({ direction: 2, height: 3, optimalScore: 1, period: 4 });
        });

        it('getRelevantHighestFallbackWhenNoOptimalScore', () => {
            expect(getSwell([
                { direction: 174.38, height: 2.93, optimalScore: 0, period: 11 },
                { direction: 170, height: 3, optimalScore: 0, period: 12 },
                { direction: 300, height: 2, optimalScore: 0, period: 3 }
            ])).toEqual({ direction: 170, height: 3, optimalScore: 0, period: 12 });
        });

        it('getRelevantHighestFallbackWhenNoOptimalScore', () => {
            expect(getSwell([
                { direction: 174.38, height: 2.93, optimalScore: 1, period: 11 },
                { direction: 170, height: 3, optimalScore: 1, period: 12 },
                { direction: 170, height: 3, optimalScore: 0, period: 12 },
                { direction: 300, height: 2, optimalScore: 0, period: 3 }
            ])).toEqual({ direction: 170, height: 3, optimalScore: 1, period: 12 });
        });

    });

    describe('getOptimalScoreSwells', () => {
        const getOptimalScoreSwells = SurflineDataSource.__get__('getOptimalScoreSwells');

        it('singleOptimalScore', () => {
            expect(getOptimalScoreSwells([
                { direction: 2, height: 3, optimalScore: 1, period: 4 },
                { direction: 20, height: 30, optimalScore: 0, period: 40 }
            ])).toEqual([{ direction: 2, height: 3, optimalScore: 1, period: 4 }]);
        });

        it('noOptimalScore', () => {
            expect(getOptimalScoreSwells([
                { direction: 2, height: 3, optimalScore: 0, period: 4 },
                { direction: 20, height: 30, optimalScore: 0, period: 40 }
            ])).toEqual([
                { direction: 2, height: 3, optimalScore: 0, period: 4 },
                { direction: 20, height: 30, optimalScore: 0, period: 40 }
            ]);
        });

        it('multipleOptimalScore', () => {
            expect(getOptimalScoreSwells([
                { direction: 2, height: 3, optimalScore: 1, period: 4 },
                { direction: 20, height: 30, optimalScore: 1, period: 40 },
                { direction: 200, height: 300, optimalScore: 0, period: 400 }
            ])).toEqual([
                { direction: 2, height: 3, optimalScore: 1, period: 4 },
                { direction: 20, height: 30, optimalScore: 1, period: 40 }
            ]);
        });
    });

    describe('getRelevantSwells', () => {
        const getRelevantSwells = SurflineDataSource.__get__('getRelevantSwells');

        it('getTheOneRelevantSwell', () => {
            expect(getRelevantSwells([
                { direction: 174.38, height: 2.93, period: 11 },
                { direction: 300, height: 2, period: 3 }
            ])).toEqual([
                { direction: 174.38, height: 2.93, period: 11 }
            ]);
        });

        it('getTheMultipleRelevantSwells', () => {
            expect(getRelevantSwells([
                { direction: 174.38, height: 2.93, period: 11 },
                { direction: 120, height: 2, period: 3 },
                { direction: 300, height: 2, period: 3 }
            ])).toEqual([
                { direction: 174.38, height: 2.93, period: 11 },
                { direction: 120, height: 2, period: 3 }
            ]);
        });

        it('getMostRelevantSwellWhenNoRelevantSwell', () => {
            expect(getRelevantSwells([
                { direction: 303, height: 2.93, period: 11 },
                { direction: 301, height: 2, period: 3 },
                { direction: 300, height: 2, period: 3 }
            ])).toEqual([
                { direction: 300, height: 2, period: 3 }
            ]);
        });
    });

    describe('getHighestSwell', () => {
        const getHighestSwell = SurflineDataSource.__get__('getHighestSwell');

        it('getSingleHighestSwell', () => {
            expect(getHighestSwell([
                { direction: 174.38, height: 2.93, period: 11 },
                { direction: 120, height: 1, period: 3 },
                { direction: 300, height: 0.5, period: 3 }
            ])).toEqual({ direction: 174.38, height: 2.93, period: 11 });
        });
    });

    describe('getSunriseWeather', () => {
        const getWeatherSummary = SurflineDataSource.__get__('getWeatherSummary');

        it('gets the weather for the morning', () => {
            const weatherEntries = {
                weather: [
                    { 'timestamp': 1569607200, 'temperature': 17, 'condition': 'NIGHT_OVERCAST_RAIN' }, // 4am, yesterday
                    { 'timestamp': 1569621600, 'temperature': 26, 'condition': 'CLEAR_RAIN' }, // 8am, yesterday
                    { 'timestamp': 1569693600, 'temperature': 18, 'condition': 'NIGHT_OVERCAST_RAIN' }, // 4am
                    { 'timestamp': 1569708000, 'temperature': 28, 'condition': 'CLEAR_NO_RAIN' }, // 8am (wanted)
                    { 'timestamp': 1569722400, 'temperature': 27, 'condition': 'CLEAR_RAIN' }, // 12pm
                    { 'timestamp': 1569722400, 'temperature': 25, 'condition': 'CLEAR_RAIN' },] // 4pm
            };
            const sunrise = 1569699420; // 5:37am
            const weatherSummary = getWeatherSummary(weatherEntries, sunrise);
            expect(weatherSummary).toEqual({ sunriseTime: '05:37', temperature: 28, weatherEmoji: '☀️' });
        });
    });

    describe('when getting beach data fails', () => {
        beforeEach(() => {
            jest.mock('axios', () => ({ get: jest.fn().mockRejectedValue({}) }));
            console.error = jest.fn();
        });

        afterEach(() => {
            jest.unmock('axios');
        });

        it('returns an empty beach data and console errors if it fails', async () => {
            const fallbackBeachData = await getBeachData('some spot name');

            expect(console.error).toHaveBeenCalled();

            expect(fallbackBeachData).toEqual(new BeachData({
                name: 'some spot name',
                rating: NaN,
                waveHeightInFeet: NaN,
                swellHeightInFeet: NaN,
                swellPeriod: NaN,
                swellDirectionEmoji: NaN,
                weatherEmoji: NaN,
                temperature: NaN,
                sunriseTime: NaN,
                windSpeedInKnots: NaN,
                windDirectionEmoji: NaN,
                tideType: NaN,
                dataSource: 'surfline',
            }));


        });
    });
});