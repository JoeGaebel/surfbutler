const axios = require('axios');
const getTomorrowsEntry = require('./utilities/timeEntry').getTomorrowMorningsEntry;
const toFirstWordUppercase = require('./utilities/stringUtils').toFirstWordUppercase;
const emojiConverter = require('./utilities/emojiConverter');
const toFeet = require('./utilities/numberUtils').toFeet;

exports.getSummary = async (spotName, spotId) => {
    const values = await Promise.all([
        getSwellSummary(spotId),
        getWaveHeightSummary(spotId),
        getTideSummary(spotId),
        getWeatherSummary(spotId),
        getWindSummary(spotId)
    ]);
    const [swells, waves, tide, weather, wind] = values;
    return `${ spotName }, ${ weather }\n${ tide }, ${ waves }, ${ wind }\nSwells:${ swells }`;
};

const getSwellSummary = async (spotId) => {
    const swellUrl = `http://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${ spotId }&days=2&intervalHours=4&maxHeights=false`;
    const swellResponse = await queryEndpoint(swellUrl);
    const swells = getTomorrowsEntry(swellResponse.wave).swells;

    let swellsText = '';
    swells.forEach(swell => {
        const height = toFeet(swell.height);
        const period = swell.period;
        const direction = emojiConverter.convertDirection(swell.direction);

        if (height > 0 && period > 0) {
            swellsText += `\n${ direction } ${ height }ft, ${ period }s`;
        }
    });

    return swellsText;
};

const getWaveHeightSummary = async (spotId) => {
    const waveHeightUrl = `http://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${ spotId }&days=2&intervalHours=4&maxHeights=true`;
    const waveHeightResponse = await queryEndpoint(waveHeightUrl);
    const maxHeight = toFeet(getTomorrowsEntry(waveHeightResponse.wave).surf.max);
    return `${ maxHeight }ft waves`;
};

const getTideSummary = async (spotId) => {
    const tideUrl = `http://services.surfline.com/kbyg/spots/forecasts/tides?spotId=${ spotId }&days=2`;
    const tideResponse = await queryEndpoint(tideUrl);
    const { type } = getTomorrowsEntry(tideResponse.tides);
    return `${ toFirstWordUppercase(type) } tide`;
};

const getWeatherSummary = async (spotId) => {
    const weatherUrl = `http://services.surfline.com/kbyg/spots/forecasts/weather?spotId=${ spotId }&days=2&intervalHours=4`;
    const weatherResponse = await queryEndpoint(weatherUrl);

    const sunrise = new Date(weatherResponse.sunlightTimes[0].sunrise * 1000).toLocaleTimeString([], {
        timeZone: 'Australia/Sydney',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const { temperature, condition } = getTomorrowsEntry(weatherResponse.weather);
    return `${ parseInt(temperature) }º ${ emojiConverter.convertWeather(condition) }, Sunrise ${ sunrise }`;
};

const getWindSummary = async (spotId) => {
    const windUrl = `http://services.surfline.com/kbyg/spots/forecasts/wind?spotId=${ spotId }&days=2&intervalHours=4`;
    const windResponse = await queryEndpoint(windUrl);

    const { direction, speed } = getTomorrowsEntry(windResponse.wind);
    return `${ emojiConverter.convertDirection(direction) }  wind at ${ parseInt(speed) }kts`;
};

const queryEndpoint = (url) => axios.get(url)
    .then(response => response.data.data)
    .catch(error => console.log(error));