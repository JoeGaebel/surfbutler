const MagicSeaWeedDataSource = require('./datasources/MagicSeaWeedDataSource');
const SurflineDataSource = require('./datasources/SurflineDataSource');
const { getCombinedData } = require('./combinator');


exports.getSummary = async (name, spotId) => {
    const [surflineBeachData, magicSeaWeedBeachData] = await Promise.all([
        SurflineDataSource.getBeachData(name, spotId),
        MagicSeaWeedDataSource.getBeachData(name)
    ]);

    const beachData = getCombinedData(surflineBeachData, magicSeaWeedBeachData);

    const weather = getFormattedWeather(beachData);
    const waves = getFormattedWaveHeight(beachData);
    const tide = getFormattedTide(beachData);
    const swells = getFormattedSwells(beachData);
    const wind = getFormattedWind(beachData);
    const rating = getFormattedRating(beachData);

    return {
        name,
        message: `${ name } ${ rating }\n${ weather }\n${ waves }, ${ tide }, the swell's ${ swells }, ${ wind }`,
        rating: beachData.rating
    };
};

const getFormattedRating = ({ rating: { activeStars, inactiveStars } }) =>
    `${ '★'.repeat(activeStars) }${ '☆'.repeat(inactiveStars) }`;
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
