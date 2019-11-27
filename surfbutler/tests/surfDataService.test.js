const { getSummary } = require('../surfDataService');
const surfDataService = require('rewire')('../surfDataService');

describe('getSummary', () => {
    beforeEach(() => {
        jest.setTimeout(10000);
    });

    it('summarizes', async () => {
        const { name, message, meta } = await getSummary('Bondi', '5842041f4e65fad6a7708bf8');
        console.log(message);

        expect(name).toEqual('Bondi');
        expect(meta.activeStars).toBeDefined();
        expect(meta.inactiveStars).toBeDefined();

        expect(message).toMatch(new RegExp('Bondi [★|☆]+'));
        expect(message).toMatch(new RegExp('.*º.*, sunrise .*:'));
        expect(message).toMatch(new RegExp('.*ft waves'));
        expect(message).toMatch(new RegExp('.*.*tide'));
        expect(message).toMatch(new RegExp('.*the swell\'s .*ft at .*s.* (⬅️|⬆️|➡️|⬇️|↙️|↖️|↗️|↘️),'));
        expect(message).toMatch(new RegExp('.* wind at .*kts (⬅️|⬆️|➡️|⬇️|↙️|↖️|↗️|↘️)$'));
    });
});

describe('getSwell', () => {
    const getSwell = surfDataService.__get__('getSwell');

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
    const getOptimalScoreSwells = surfDataService.__get__('getOptimalScoreSwells');

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
    const getRelevantSwells = surfDataService.__get__('getRelevantSwells');

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
    const getHighestSwell = surfDataService.__get__('getHighestSwell');

    it('getSingleHighestSwell', () => {
        expect(getHighestSwell([
            { direction: 174.38, height: 2.93, period: 11 },
            { direction: 120, height: 1, period: 3 },
            { direction: 300, height: 0.5, period: 3 }
        ])).toEqual({ direction: 174.38, height: 2.93, period: 11 });
    });
});

describe('getSunriseWeather', () => {
    const getWeatherSummary = surfDataService.__get__('getWeatherSummary');

    it('Get weather for the morning', () => {
        const weatherEntries = {
            weather: [
                { 'timestamp': 1569607200, 'temperature': 17, 'condition': 'NIGHT_OVERCAST_RAIN' }, // 4am, yesterday
                { 'timestamp': 1569621600, 'temperature': 26, 'condition': 'CLEAR_RAIN' }, // 8am, yesterday
                { 'timestamp': 1569693600, 'temperature': 18, 'condition': 'NIGHT_OVERCAST_RAIN' }, // 4am
                { 'timestamp': 1569708000, 'temperature': 28, 'condition': 'CLEAR_NO_RAIN' }, // 8am (wanted)
                { 'timestamp': 1569722400, 'temperature': 27, 'condition': 'CLEAR_RAIN' }, // 12pm
                { 'timestamp': 1569722400, 'temperature': 25, 'condition': 'CLEAR_RAIN' }, ] // 4pm
        };
        const sunrise = 1569699420; // 5:37am
        const weatherSummary = getWeatherSummary(weatherEntries, sunrise);
        expect(weatherSummary).toEqual('28º ☀️, sunrise 05:37');
    });
});