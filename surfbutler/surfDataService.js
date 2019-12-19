const { getRating } = require('./ratingService');
const SurflineDataSource = require('./datasources/surflineDataSource');


exports.getSummary = async (name, spotId) => {
    const beachData = await SurflineDataSource.getBeachData(name, spotId);
    const rating = await getRating(name);

    const weather = getFormattedWeather(beachData);
    const waves = getFormattedWaveHeight(beachData);
    const tide = getFormattedTide(beachData);
    const swells = getFormattedSwells(beachData);
    const wind = getFormattedWind(beachData);

    return {
        name,
        message: `${ name } ${ rating.string }\n${ weather }\n${ waves }, ${ tide }, the swell's ${ swells }, ${ wind }`,
        meta: rating.meta
    };
};

const getFormattedWaveHeight = ({ waveHeightInFeet }) =>
    `${ waveHeightInFeet }ft waves`;
const getFormattedTide = ({ tideType }) =>
    `${ tideType.toLowerCase() } tide`;
const getFormattedWeather = ({ sunriseTime, temperature, weatherEmoji }) =>
    `${ temperature }º ${ weatherEmoji }, sunrise ${ sunriseTime }`;
const getFormattedSwells = ({ swellHeightInFeet, swellPeriod, swellDirectionEmoji }) =>
    `${ swellHeightInFeet }ft at ${ swellPeriod }s ${ swellDirectionEmoji }`;
const getFormattedWind = ({ windSpeed, windDirectionEmoji }) =>
    `wind at ${ windSpeed }kts ${ windDirectionEmoji }`;
