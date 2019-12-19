const MagicSeaWeedDataSource = require('./datasources/MagicSeaWeedDataSource');
const SurflineDataSource = require('./datasources/SurflineDataSource');


exports.getSummary = async (name, spotId) => {
    const [surflineBeachData, magicSeaWeedBeachData] = await Promise.all([
        SurflineDataSource.getBeachData(name, spotId),
        MagicSeaWeedDataSource.getBeachData(name)
    ]);

    const { rating } = magicSeaWeedBeachData;

    const weather = getFormattedWeather(surflineBeachData);
    const waves = getFormattedWaveHeight(surflineBeachData);
    const tide = getFormattedTide(surflineBeachData);
    const swells = getFormattedSwells(surflineBeachData);
    const wind = getFormattedWind(surflineBeachData);

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
