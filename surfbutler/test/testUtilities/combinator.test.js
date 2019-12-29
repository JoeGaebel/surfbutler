const { round } = require('../../src/utilities/numberUtils');
const { BeachData } = require('../../src/datasources/BeachData');
const { getCombinedData } = require('../../src/combinator');

describe('Combinator#getCombinedData', () => {
    let mswBeachData, surflineBeachData;

    beforeEach(() => {
        mswBeachData = new BeachData({
            dataSource: 'msw',
            rating: {
                string: '****',
                meta: { active: 2, inactive: 3 }
            },
            waveHeightInFeet: 2.5,
            swellHeightInFeet: 3,
            swellPeriod: 5,
            windSpeedInKnots: 20,
        });

        surflineBeachData = new BeachData({
            dataSource: 'surfline',
            waveHeightInFeet: 5,
            swellHeightInFeet: 9,
            swellPeriod: 10,
            swellDirectionEmoji: '⬆️',
            temperature: 25,
            weatherEmoji: '☀️',
            sunriseTime: '5:45AM',
            windSpeedInKnots: 30,
            windDirectionEmoji: '⬇️',
            tideType: 'NORMAL'
        });
    });

    const fieldsToAverage = [
        'waveHeightInFeet',
        'swellHeightInFeet',
        'swellPeriod',
        'windSpeedInKnots'
    ];

    it.each(fieldsToAverage)('averages %p to one decimal place', (field) => {
        const mswField = mswBeachData[field];
        const surflineField = surflineBeachData[field];

        const combinedField = getCombinedData(mswBeachData, surflineBeachData)[field];

        const roundedAndAveragedValue = round((mswField + surflineField) / 2.0, 1);
        expect(combinedField).toEqual(roundedAndAveragedValue);
    });

    it.each(fieldsToAverage)('does not average if %p is missing', (field) => {
        mswBeachData = new BeachData({ dataSource: 'msw' });

        const surflineField = surflineBeachData[field];
        const combinedField = getCombinedData(mswBeachData, surflineBeachData)[field];

        expect(combinedField).toEqual(surflineField);
    });

    it.each(fieldsToAverage)('does not average if %p is a NaN', (field) => {
        mswBeachData = new BeachData({
            dataSource: 'msw',
            rating: {
                string: '****',
                meta: { active: 2, inactive: 3 }
            },
            waveHeightInFeet: NaN,
            swellHeightInFeet: NaN,
            swellPeriod: NaN,
            windSpeedInKnots: NaN,
        });

        const surflineField = surflineBeachData[field];
        const combinedField = getCombinedData(mswBeachData, surflineBeachData)[field];

        expect(combinedField).toEqual(surflineField);
    });

    it('returns the rating from MagicSeaWeed', () => {
        expect(surflineBeachData.rating).toBeUndefined();
        const { rating } = getCombinedData(mswBeachData, surflineBeachData);

        expect(rating).toBeDefined();
        expect(rating).toEqual(mswBeachData.rating);
    });

    it.each([
        'tideType',
        'sunriseTime',
        'temperature',
        'weatherEmoji',
        'swellDirectionEmoji',
        'windDirectionEmoji'
    ])('returns the %p from Surfline', (field) => {
        const fieldData = getCombinedData(mswBeachData, surflineBeachData)[field];

        expect(fieldData).toBeDefined();
        expect(fieldData).toEqual(surflineBeachData[field]);
    });
});