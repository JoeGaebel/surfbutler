const axios = require('axios');
const getClosestTimeEntry = require('./utilities/timeEntry').getClosest;
const emojiConverter = require('./utilities/emojiConverter');
const toFeet = require('./utilities/numberUtils').toFeet;

exports.getSummary = async (spotName, spotId) => {
    const weatherResponse = await getWeatherData(spotId);
    const sunriseTimestamp = getSunrise(weatherResponse).getTime() / 1000;

    const values = await Promise.all([
        getSwellSummary(spotId, sunriseTimestamp),
        getWaveHeightSummary(spotId, sunriseTimestamp),
        getTideSummary(spotId, sunriseTimestamp),
        getWeatherSummary(weatherResponse, sunriseTimestamp),
        getWindSummary(spotId)
    ]);
    const [swells, waves, tide, weather, wind] = values;

    return {
        message: `${ spotName }, ${ weather }\nThe swell's ${ swells } on a ${ tide }, ${ waves }, ${ wind }`,
        name: spotName
    };
};

// Nullable
const getSwellSummary = async (spotId, sunriseTimestamp) => {
    const swellUrl = `http://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${ spotId }&days=2&intervalHours=4&maxHeights=false`;
    const swellResponse = await queryEndpoint(swellUrl);
    const swells = getClosestTimeEntry(swellResponse.wave, sunriseTimestamp).swells;

    let swellsText;
    let heighestHeight = 0;
    swells.forEach(swell => {
        const height = toFeet(swell.height);
        const period = swell.period;
        const direction = emojiConverter.convertDirection(swell.direction);

        if (height > heighestHeight) {
            swellsText = `${ height }ft at ${ period }s ${ direction }`;
            heighestHeight = height;
        } else if (height === heighestHeight) {
            // logging so that we can verify if this can happen and improve which of the swells we display in that case
            console.log('There where two equal heights');
        }
    });

    return swellsText;
};

const getWaveHeightSummary = async (spotId, sunriseTimestamp) => {
    const waveHeightUrl = `http://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${ spotId }&days=2&intervalHours=4&maxHeights=true`;
    const waveHeightResponse = await queryEndpoint(waveHeightUrl);
    const maxHeight = toFeet(getClosestTimeEntry(waveHeightResponse.wave, sunriseTimestamp).surf.max);
    return `${ maxHeight }ft waves`;
};

const getTideSummary = async (spotId, sunriseTimestamp) => {
    const tideUrl = `http://services.surfline.com/kbyg/spots/forecasts/tides?spotId=${ spotId }&days=2`;
    const tideResponse = await queryEndpoint(tideUrl);
    const { type } = getClosestTimeEntry(tideResponse.tides, sunriseTimestamp);
    return `${ type.toLowerCase() } tide`;
};


const getWeatherData = async (spotId) => {
    const weatherUrl = `http://services.surfline.com/kbyg/spots/forecasts/weather?spotId=${ spotId }&days=2&intervalHours=4`;
    return await queryEndpoint(weatherUrl);
};

const getSunrise = (weatherResponse) => {
    return new Date(weatherResponse.sunlightTimes[1].sunrise * 1000);
};

const getWeatherSummary = (weatherResponse, sunriseTimestamp) => {
    const sunriseTime = new Date(sunriseTimestamp * 1000).toLocaleTimeString([], {
        timeZone: 'Australia/Sydney',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const { temperature, condition } = getClosestTimeEntry(weatherResponse.weather, sunriseTimestamp);
    return `${ parseInt(temperature) }º ${ emojiConverter.convertWeather(condition) }, sunrise ${ sunriseTime }`;
};

const getWindSummary = async (spotId, sunriseTimestamp) => {
    const windUrl = `http://services.surfline.com/kbyg/spots/forecasts/wind?spotId=${ spotId }&days=2&intervalHours=4`;
    const windResponse = await queryEndpoint(windUrl);

    const { direction, speed } = getClosestTimeEntry(windResponse.wind, sunriseTimestamp);
    return `wind at ${ parseInt(speed) }kts ${ emojiConverter.convertDirection(direction) }`;
};

const queryEndpoint = (url) => axios.get(url)
    .then(response => response.data.data)
    .catch(error => console.log(error));
