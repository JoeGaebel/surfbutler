const MagicSeaWeedDataSource = require('./datasources/MagicSeaWeedDataSource');
const SurflineDataSource = require('./datasources/SurflineDataSource');
const { getCombinedData } = require('./combinator');


exports.getSummary = async (name, spotId) => {
    const [surflineBeachData, magicSeaWeedBeachData] = await Promise.all([
        SurflineDataSource.getBeachData(name, spotId),
        MagicSeaWeedDataSource.getBeachData(name)
    ]);

    const beachData = getCombinedData(surflineBeachData, magicSeaWeedBeachData);

    const { rating } = beachData;
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
const getFormattedWind = ({ windSpeedInKnots, windDirectionEmoji }) =>
    `wind at ${ windSpeedInKnots }kts ${ windDirectionEmoji }`;
