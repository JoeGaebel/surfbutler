const axios = require('axios');

const queryEndpoint = (url) => axios.get(url)
    .then(response => response.data.data)
    .catch(error => console.log(error));

module.exports = (async () => {
    const bondiSpotId = '5842041f4e65fad6a7708bf8';
    const tamaramaSpotId = '584204204e65fad6a77093eb';
    const bronteSpotId = '584204204e65fad6a77093ef';

    const spots = [bondiSpotId, tamaramaSpotId, bronteSpotId, '584204204e65fad6a77093cd', '584204204e65fad6a77093ce', '584204204e65fad6a77093d1', '5842041f4e65fad6a7708c00', '5842041f4e65fad6a7708bfd', '584204204e65fad6a77093ff', '584204204e65fad6a770928a', '584204204e65fad6a770928c', '5842041f4e65fad6a7708bec', '584204204e65fad6a77092a4', '584204204e65fad6a770934a', '584204204e65fad6a7709350', '584204204e65fad6a7709350', '584204204e65fad6a770967b', '5842041f4e65fad6a7708d8e', '5842041f4e65fad6a7708d8a', '5842041f4e65fad6a7708d8e', '5842041f4e65fad6a7708d8a', '5842041f4e65fad6a7708d8c'];
    
    const weatherConditions = new Set('NIGHT_OVERCAST_NO_RAIN',
  'OVERCAST_NO_RAIN',
  'NIGHT_CLEAR_NO_RAIN',
  'CLEAR_NO_RAIN',
  'PARTLY_CLOUDY_NO_RAIN',
  'OVERCAST_RAIN',
  'MOSTLY_CLOUDY_RAIN',
  'NIGHT_MOSTLY_CLOUDY_NO_RAIN',
  'MOSTLY_CLOUDY_NO_RAIN',
  'NIGHT_PARTLY_CLOUDY_NO_RAIN',
  'CLEAR_RAIN',
  'NIGHT_PARTLY_CLOUDY_RAIN',
  'MOSTLY_CLEAR_NO_RAIN',
  'NIGHT_MOSTLY_CLEAR_NO_RAIN',
  'NIGHT_OVERCAST_RAIN');

    for (const spotId of spots) {
        const weatherUrl = `http://services.surfline.com/kbyg/spots/forecasts/weather?spotId=${ spotId }&days=6&intervalHours=12`;
        const weatherResponse = await queryEndpoint(weatherUrl);
        for (const weatherEntry of weatherResponse.weather) {
            weatherConditions.add(weatherEntry.condition);
        }
    }

    console.log(weatherConditions);
})();
