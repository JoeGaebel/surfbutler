const { round } = require('../../src/utilities/numberUtils');
const { BeachData } = require('../../src/datasources/BeachData');
const { getCombinedData } = require('../../src/combinator');

describe('Combinator#getCombinedData', () => {
    let mswBeachData, surflineBeachData, surfForecastBeachData;

    beforeEach(() => {
        console.error = jest.fn();

        mswBeachData = new BeachData({
            dataSource: 'msw',
            rating: 3,
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

        surfForecastBeachData = new BeachData({
            dataSource: 'surfforecast',
            rating: 2.5
        });
    });

    const fieldsToAverage = [
        'waveHeightInFeet',
        'swellHeightInFeet',
        'swellPeriod',
        'windSpeedInKnots',
        'rating'
    ];

    it.each(fieldsToAverage)('averages %p to one decimal place', (field) => {
        const mswField = mswBeachData[field];
        const surflineField = surflineBeachData[field];
        const surfForecastField = surfForecastBeachData[field];

        const combinedField = getCombinedData(mswBeachData, surflineBeachData, surfForecastBeachData)[field];

        const numerator = (mswField || 0) + (surflineField || 0) + (surfForecastField || 0);
        const denominator = (isFinite(mswField) ? 1 : 0) +
            (isFinite(surflineField) ? 1 : 0) +
            (isFinite(surfForecastField) ? 1 : 0);

        const roundedAndAveragedValue = round(numerator / denominator, 1);
        expect(combinedField).toEqual(roundedAndAveragedValue);
    });

    it.each(fieldsToAverage)('does not average if %p is missing', (field) => {
        mswBeachData = new BeachData({ dataSource: 'msw' });
        surfForecastBeachData = new BeachData({ dataSource: 'surfforecast' });
        surflineBeachData.rating = 5;


        const surflineField = surflineBeachData[field];
        const combinedField = getCombinedData(mswBeachData, surflineBeachData, surfForecastBeachData)[field];

        expect(combinedField).toEqual(surflineField);
    });

    it.each(fieldsToAverage)('returns 0 if no data is present for %p', (field) => {
        mswBeachData = new BeachData({ dataSource: 'msw' });
        surflineBeachData = new BeachData({ dataSource: 'surfline' });
        surfForecastBeachData = new BeachData({ dataSource: 'surfforecast' });

        const combinedField = getCombinedData(mswBeachData, surflineBeachData, surfForecastBeachData)[field];

        expect(console.error).toHaveBeenCalledWith(`NO DATA FOUND FOR ${ field } ACROSS ALL DATA SOURCES`);
        expect(combinedField).toEqual(0);
    });

    it.each(fieldsToAverage)('does not average if %p is a NaN', (field) => {
        surflineBeachData.rating = 1;

        mswBeachData = new BeachData({
            dataSource: 'msw',
            rating: NaN,
            waveHeightInFeet: NaN,
            swellHeightInFeet: NaN,
            swellPeriod: NaN,
            windSpeedInKnots: NaN,
        });

        surfForecastBeachData = new BeachData({
            dataSource: 'msw',
            rating: NaN,
            waveHeightInFeet: NaN,
            swellHeightInFeet: NaN,
            swellPeriod: NaN,
            windSpeedInKnots: NaN,
        });

        const surflineField = surflineBeachData[field];
        const combinedField = getCombinedData(mswBeachData, surflineBeachData, surfForecastBeachData)[field];

        expect(combinedField).toEqual(surflineField);
    });

    it.each([
        'tideType',
        'sunriseTime',
        'temperature',
        'weatherEmoji',
        'swellDirectionEmoji',
        'windDirectionEmoji'
    ])('returns the %p from Surfline', (field) => {
        const fieldData = getCombinedData(mswBeachData, surflineBeachData, surfForecastBeachData)[field];

        expect(fieldData).toBeDefined();
        expect(fieldData).toEqual(surflineBeachData[field]);
    });
});