const axios = require('axios');
const getClosestTimeEntry = require('./utilities/timeEntry').getClosest;
const compassToDirection = require('./utilities/compass').toDirection;

exports.getSummary = async (spotName, spotId) => `The surf report for ${spotName} currently is:
${ await getSwellSummary(spotId)}
${ await getWaveHeightSummary(spotId)}
${ await getTideSummary(spotId)}
${ await getWeatherSummary(spotId)}
${ await getWindSummary(spotId)}`;

const getSwellSummary = async (spotId) => {
    const swellUrl = `http://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${spotId}&days=1&intervalHours=4&maxHeights=false`;
    const swellResponse = await queryEndpoint(swellUrl);
    const swells = getClosestTimeEntry(swellResponse.wave).swells;
    
    let swellsText = ``;
    swells.forEach(swell => {
        const height = swell.height;
        const period = swell.period;
        const direction = compassToDirection(swell.direction);

        if (height > 0 && period > 0) {
            swellsText += `\nSwell: ${height}m @ ${period}s from ${direction}`
        }
    });

    return swellsText;
}

const getWaveHeightSummary = async (spotId) => {
const waveHeightUrl = `http://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${spotId}&days=1&intervalHours=4&maxHeights=true`;
const waveHeightResponse = await queryEndpoint(waveHeightUrl);
const maxHeight = getClosestTimeEntry(waveHeightResponse.wave).surf.max;
return `Wave height: ${maxHeight}m`;
};

const getTideSummary = async (spotId) => {
const tideUrl = `http://services.surfline.com/kbyg/spots/forecasts/tides?spotId=${spotId}&days=1`;
const tideResponse = await queryEndpoint(tideUrl);
const {type, height} = getClosestTimeEntry(tideResponse.tides);
return `Tide: ${type} (${height}m)`;
};

const getWeatherSummary = async (spotId) => {
const weatherUrl = `http://services.surfline.com/kbyg/spots/forecasts/weather?spotId=${spotId}&days=1&intervalHours=4`;
const weatherResponse = await queryEndpoint(weatherUrl);

const sunrise = new Date(weatherResponse.sunlightTimes[0].sunrise * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
});
const {temperature, condition} = getClosestTimeEntry(weatherResponse.weather);
return `Sunrise: ${sunrise}\nWeather: ${temperature}ºC ${condition}`;
};

const getWindSummary = async (spotId) => {
const windUrl = `http://services.surfline.com/kbyg/spots/forecasts/wind?spotId=${spotId}&days=1&intervalHours=4`;
const windResponse = await queryEndpoint(windUrl);

const {direction, speed} = getClosestTimeEntry(windResponse.wind);
return `Wind: ${compassToDirection(direction)} (${speed}kts)`;
};

const queryEndpoint = (url) => axios.get(url)
.then(response => response.data.data)
.catch(error => console.log(error));