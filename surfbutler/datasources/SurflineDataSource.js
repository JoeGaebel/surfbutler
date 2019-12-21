const { toFeet } = require('../utilities/numberUtils');
const { BeachData } = require('./BeachData');
const axios = require('axios');
const axiosRetry = require('axios-retry');
const { getClosest, getMorningWeather } = require('../utilities/timeEntry');
const { convertDirection, convertWeather } = require('../utilities/emojiConverter');

axiosRetry(axios, { retries: 10, retryDelay: axiosRetry.exponentialDelay });

const getBeachData = async (name, spotId) => {
    const weatherResponse = await getWeatherData(spotId);
    const sunriseTimestamp = getSunriseTimestamp(weatherResponse);

    const values = await Promise.all([
        getWaveHeightSummary(spotId, sunriseTimestamp),
        getSwellSummary(spotId, sunriseTimestamp),
        getTideSummary(spotId, sunriseTimestamp),
        getWeatherSummary(weatherResponse, sunriseTimestamp),
        getWindSummary(spotId, sunriseTimestamp),
    ]);

    const [
        waveHeightInFeet,
        {
            swellHeightInFeet,
            swellPeriod,
            swellDirectionEmoji
        },
        { tideType },
        {
            temperature,
            weatherEmoji,
            sunriseTime,
        },
        {
            windSpeedInKnots,
            windDirectionEmoji
        }
    ] = values;

    return new BeachData({
        name,
        waveHeightInFeet,
        swellHeightInFeet,
        swellPeriod,
        swellDirectionEmoji,
        temperature,
        weatherEmoji,
        sunriseTime,
        windSpeedInKnots,
        windDirectionEmoji,
        tideType
    });
};

exports.getBeachData = getBeachData;

const getSwellSummary = async (spotId, sunriseTimestamp) => {
    const swellUrl = `http://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${ spotId }&days=2&intervalHours=4&maxHeights=false`;
    const swellResponse = await queryEndpoint(swellUrl);
    const { height, period, direction } = getSwell(getClosest(swellResponse.wave, sunriseTimestamp).swells);

    return {
        swellHeightInFeet: toFeet(height),
        swellPeriod: period,
        swellDirectionEmoji: convertDirection(direction)
    };
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
            console.log('There where two equaly high swells:', swell, 'and ', highestSwell);
        }
    });
    return highestSwell;
};

const getWaveHeightSummary = async (spotId, sunriseTimestamp) => {
    const waveHeightUrl = `http://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${ spotId }&days=2&intervalHours=4&maxHeights=true`;
    const waveHeightResponse = await queryEndpoint(waveHeightUrl);
    return toFeet(getClosest(waveHeightResponse.wave, sunriseTimestamp).surf.max);
};

const getTideSummary = async (spotId, sunriseTimestamp) => {
    const tideUrl = `http://services.surfline.com/kbyg/spots/forecasts/tides?spotId=${ spotId }&days=2`;
    const tideResponse = await queryEndpoint(tideUrl);
    return { tideType: getClosest(tideResponse.tides, sunriseTimestamp).type };
};


const getSunriseTimestamp = (weatherResponse) => {
    return weatherResponse.sunlightTimes[1].sunrise;
};

const getWeatherSummary = (weatherResponse, sunriseTimestamp) => {
    const sunriseTime = new Date(sunriseTimestamp * 1000).toLocaleTimeString([],
        { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: false });
    const { temperature, condition } = getMorningWeather(weatherResponse.weather, sunriseTimestamp);
    return {
        temperature: parseInt(temperature),
        weatherEmoji: convertWeather(condition),
        sunriseTime: sunriseTime
    };
};

const getWindSummary = async (spotId, sunriseTimestamp) => {
    const windUrl = `http://services.surfline.com/kbyg/spots/forecasts/wind?spotId=${ spotId }&days=2&intervalHours=4`;
    const windResponse = await queryEndpoint(windUrl);

    const { direction, speed } = getClosest(windResponse.wind, sunriseTimestamp);

    return {
        windSpeedInKnots: parseInt(speed),
        windDirectionEmoji: convertDirection(direction)
    };
};

const queryEndpoint = (url) => axios.get(url)
    .then(response => response.data.data)
    .catch(error => console.log('Error while quering the API endpoint: ', url, ' ',
        error));

const getWeatherData = async (spotId) => {
    const weatherUrl = `http://services.surfline.com/kbyg/spots/forecasts/weather?spotId=${ spotId }&days=2&intervalHours=4`;
    return await queryEndpoint(weatherUrl);
};
