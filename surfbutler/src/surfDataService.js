const MagicSeaWeedDataSource = require('./datasources/MagicSeaWeedDataSource');
const SurflineDataSource = require('./datasources/SurflineDataSource');
const SurfForecastDataSource = require('./datasources/SurfForecastDataSource');
const { round } = require('./utilities/numberUtils');
const { getCombinedData } = require('./combinator');


exports.getSummary = async (name, spotId) => {
    const beachDatas = await Promise.all([
        SurflineDataSource.getBeachData(name, spotId),
        MagicSeaWeedDataSource.getBeachData(name),
        SurfForecastDataSource.getBeachData(name)
    ]);

    const beachData = getCombinedData(...beachDatas);
    const roundedRating = round(beachData.rating, 0);

    const weather = getFormattedWeather(beachData);
    const waves = getFormattedWaveHeight(beachData);
    const tide = getFormattedTide(beachData);
    const swells = getFormattedSwells(beachData);
    const wind = getFormattedWind(beachData);
    const rating = getFormattedRating(roundedRating);

    return {
        name,
        message: `${ name } ${ rating }\n${ weather }\n${ waves }, ${ tide }, the swell's ${ swells }, ${ wind }`,
        rating: roundedRating
    };
};

const getFormattedRating = (rating) =>
    '★'.repeat(rating);
const getFormattedWaveHeight = ({ waveHeightInFeet }) =>
    `${ waveHeightInFeet }ft waves`;
const getFormattedTide = ({ tideType }) =>
    `${ tideType.toLowerCase() } tide`;
const getFormattedWeather = ({ sunriseTime, temperature, weatherEmoji }) =>
    `${ temperature }º ${ weatherEmoji }, sunrise ${ sunriseTime }`;
const getFormattedSwells = ({ swellHeightInFeet, swellPeriod, swellDirectionEmoji }) =>
    `${ swellHeightInFeet }ft at ${ swellPeriod }s ${ swellDirectionEmoji }`;
const getFormattedWind = ({ windSpeedInKnots, windDirectionEmoji }) =>
    `wind at ${ windSpeedInKnots }kts ${ windDirectionEmoji }`;
