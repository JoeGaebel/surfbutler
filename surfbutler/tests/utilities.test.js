jest.mock('../utilities/clock');
const getCurrentTimestamp = require('../utilities/clock').getCurrentTimestamp;
const getCurrentEntry = require('../utilities/timeEntry').getCurrentEntry;
const convertDirection = require('../utilities/emojiConverter').convertDirection;
const convertWeather = require('../utilities/emojiConverter').convertWeather;
const toFeet = require('../utilities/numberUtils').toFeet;
const round = require('../utilities/numberUtils').round;

describe('getCurrentEntry', () => {
    const currentTime = 1552068000000;
    beforeEach(() => {
        getCurrentTimestamp.mockReturnValue(currentTime);
    });

    it('Get the closest time entry', () => {
        const elements = [
            { 'timestamp': currentTime + 100 },
            { 'timestamp': currentTime - 100 },
            { 'timestamp': currentTime + 50 },
        ];

        const closest = getCurrentEntry(elements);
        expect(closest.timestamp).toEqual(currentTime + 50);
    });
});

describe('compassDegreesToDirection', () => {
    it('Test for N', () => {
        expect(convertDirection(0)).toEqual('⬇️');
        expect(convertDirection(10)).toEqual('⬇️');
        expect(convertDirection(350)).toEqual('⬇️');
        expect(convertDirection(360)).toEqual('⬇️');
    });
    it('Test for S', () => {
        expect(convertDirection(170)).toEqual('⬆️');
        expect(convertDirection(191)).toEqual('⬆️');
    });
    it('Test for W', () => {
        expect(convertDirection(260)).toEqual('➡️');
        expect(convertDirection(280)).toEqual('➡️');
    });
    it('Test for E', () => {
        expect(convertDirection(80)).toEqual('⬅️');
        expect(convertDirection(100)).toEqual('⬅️');
    });
    it('Test invalid value', () => {
        expect(convertDirection(400)).toEqual(400);
        expect(convertDirection('Text')).toEqual('Text');
    });
});

describe('convertWeather', () => {
    it('Test sun', () => {
        expect(convertWeather('CLEAR_NO_RAIN')).toEqual('☀️');
    });
    it('Test rain', () => {
        expect(convertWeather('CLEAR_RAIN')).toEqual('🌧');
        expect(convertWeather('OVERCAST_RAIN')).toEqual('🌧');
    });
    it('Test night', () => {
        expect(convertWeather('NIGHT_PARTLY_CLOUDY_NO_RAIN')).toEqual('✨');
        expect(convertWeather('NIGHT_PARTLY_CLOUDY_RAIN')).toEqual('✨');
        expect(convertWeather('NIGHT_OVERCAST_RAIN')).toEqual('✨');
    });
    it('Test invalid value', () => {
        expect(convertWeather(400)).toEqual(400);
        expect(convertWeather('Text')).toEqual('Text');
    });
});

describe('numberUtils', () => {
    it('toFeet', () => {
       expect(toFeet(1)).toEqual(3.3);
    });
    it('round', () => {
        expect(round(1, 1)).toEqual(1);
        expect(round(1.5, 0)).toEqual(2);
        expect(round(1.4, 1)).toEqual(1.4);
        expect(round(0.4329841, 1)).toEqual(0.4);
        expect(round(0.4529841, 1)).toEqual(0.5);
    });
});
