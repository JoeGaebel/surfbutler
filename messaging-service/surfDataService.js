const axios = require('axios');
const getClosestTimeEntry = require('./utilities/timeEntry').getClosest;
const emojiConverter = require('./utilities/emojiConverter');
const toFeet = require('./utilities/numberUtils').toFeet;
const axiosRetry = require('axios-retry');

axiosRetry(axios, { retries: 10, retryDelay: axiosRetry.exponentialDelay });

exports.getSummary = async (name, spotId) => {
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
        name,
        message: `${ name }, ${ weather }\n${ waves }, ${ tide }, the swell's ${ swells }, ${ wind }`
    };
};

const getSwellSummary = async (spotId, sunriseTimestamp) => {
    const swellUrl = `http://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${ spotId }&days=2&intervalHours=4&maxHeights=false`;
    const swellResponse = await queryEndpoint(swellUrl);
    const { height, period, direction } = getSwell(getClosestTimeEntry(swellResponse.wave, sunriseTimestamp).swells);
    return `${ toFeet(height) }ft at ${ period }s ${ emojiConverter.convertDirection(direction) }`;
};

const getSwell = (swells) => {
    const relevantSwells = getOptimalScoreSwells(swells);
    if (relevantSwells !== undefined && relevantSwells.length === 1) {
        return relevantSwells[0];
    }
    return getHighestSwell(getRelevantSwells(swells));
};

const getOptimalScoreSwells = (swells) => {
    const optimalScoreSwell = swells.filter(swell => {
        return swell.optimalScore === 1;
    });

    if (optimalScoreSwell === undefined || optimalScoreSwell.length === 0) {
        return swells;
    }
    return optimalScoreSwell;
};

const getRelevantSwells = (swells) => {
    const relevantSwells = [];
    swells.forEach(swell => {
        // Between N and S
        if (swell.direction > 0 && swell.direction <= 191.25) {
            relevantSwells.push(swell);
        }
    });

    if (relevantSwells.length === 0) {
        console.log('There wasn\'t a relevant swell', swells);
        // take the smallest direction since that's the least west
        let smallestDirection = 360;
        let smallestDirectionSwell = swells[0];
        swells.forEach(swell => {
            if (swell.direction < smallestDirection && swell.height > 0 && swell.period > 0) {
                smallestDirection = swell.direction;
                smallestDirectionSwell = swell;
            }
        });
        relevantSwells.push(smallestDirectionSwell);
    }
    return relevantSwells;
};

const getHighestSwell = (swells) => {
    let highestHeight = 0;
    let highestSwell;
    swells.forEach(swell => {
        if (swell.height > highestHeight) {
            highestHeight = swell.height;
            highestSwell = swell;
        } else if (swell.height === highestHeight) {
            // logging so that we can verify if this can happen and improve which of the swells we display in that case
            console.log('There where two equaly high swells:', swell,  'and ', highestSwell);
        }
    });
    return highestSwell;
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
    .catch(error => console.log('Error while quering the API endpoint: ', url, ' ',
        error));
