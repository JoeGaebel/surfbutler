jest.mock('../utilities/clock');
const getCurrentTimestamp = require('../utilities/clock').getCurrentTimestamp;
const getClosestTimeEntry = require('../utilities/timeEntry').getClosest;
const convertDirection = require('../utilities/emojiConverter').convertDirection;
const convertWeather = require('../utilities/emojiConverter').convertWeather;
const toFirstWordUppercase = require('../utilities/stringUtils').toFirstWordUppercase;

describe('getClosestTimeEntry', () => {
    const currentTime = 1552068000;
    beforeEach(() => {
        getCurrentTimestamp.mockReturnValue(currentTime);
    });

    it('Get the closest time entry', () => {
        const elements = [
            { 'timestamp': currentTime + 100 },
            { 'timestamp': currentTime - 100 },
            { 'timestamp': currentTime + 50 },
        ];

        const closest = getClosestTimeEntry(elements);
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
