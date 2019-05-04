jest.mock('../utilities/clock');
const getCurrentTimestamp = require('../utilities/clock').getCurrentTimestamp;
const getCurrentEntry = require('../utilities/timeEntry').getCurrentEntry;
const getTomorrowsEntry = require('../utilities/timeEntry').getTomorrowMorningsEntry;
const convertDirection = require('../utilities/emojiConverter').convertDirection;
const convertWeather = require('../utilities/emojiConverter').convertWeather;
const toFirstWordUppercase = require('../utilities/stringUtils').toFirstWordUppercase;

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

describe('getTomorrowsEntry', () => {
    const currentTime = 1556956800000; // 4 May 2019 18:00 GMT+10:00
    beforeEach(() => {
        getCurrentTimestamp.mockReturnValue(currentTime);
    });

    const tomorrowMorning = 1557000000000; // 5 May 2019 6:00 GMT+10:00
    const tomorrowAfternoon = 1557028800000;  // 5 May 2019 14:00 GMT+10:00
    it('Get the closest time entry', () => {
        const elements = [
            { 'timestamp': currentTime + 100 },
            { 'timestamp': currentTime - 100 },
            { 'timestamp': currentTime + 50 },
            { 'timestamp': tomorrowMorning },
            { 'timestamp': tomorrowAfternoon }
        ];

        const closest = getTomorrowsEntry(elements);
        expect(closest.timestamp).toEqual(tomorrowMorning);
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

describe('stringUtils', () => {
    it('toFirstWordUppercase', () => {
        expect(toFirstWordUppercase('HELLO WORLD')).toEqual('Hello world');
        expect(toFirstWordUppercase('hello world')).toEqual('Hello world');
        expect(toFirstWordUppercase('Hello world')).toEqual('Hello world');
        expect(toFirstWordUppercase('Hello world!')).toEqual('Hello world!');
        expect(toFirstWordUppercase('1234')).toEqual('1234');
        expect(toFirstWordUppercase('!?')).toEqual('!?');
    });
});
