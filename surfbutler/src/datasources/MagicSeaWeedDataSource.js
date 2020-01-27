const { BeachData } = require('./BeachData');
const { round } = require('../utilities/numberUtils');

const rp = require('request-promise');
const $ = require('cheerio');
const moment = require('moment-timezone');

exports.getBeachData = async (spotName) => {
    const url = mswURLs[spotName];
    const html = await rp(url);

    const tomorrowsDate = moment.tz('Australia/Sydney').add(1, 'day').format('DDMM');
    const sixAMRow = $(`tr[data-date$="${ tomorrowsDate }"]`, html)[2];

    const waveHeightInFeet = getWaveHeight(sixAMRow);
    const swellHeightInFeet = getSwellHeight(sixAMRow);
    const swellPeriod = getSwellPeriod(sixAMRow);
    const windSpeedInKnots = getWindSpeedInKnots(sixAMRow);
    const rating = getRating(sixAMRow);

    return new BeachData({
        rating,
        waveHeightInFeet,
        swellHeightInFeet,
        swellPeriod,
        name: spotName,
        windSpeedInKnots,
        dataSource: 'msw'
    });
};

const getWaveHeight = (row) => {
    const field = $('.table-forecast-breaking-wave', row)
        .text()
        .replace('ft', '')
        .trim();

    if (field.includes('-')) {
        const [lower, upper] = field.split('-');
        return (parseInt(lower) + parseInt(upper)) / 2.0;
    } else {
        return parseInt(field);
    }
};

const getSwellHeight = (row) => {
    const heightString = $($('.background-gray-lighter', row)[0])
        .text()
        .replace('ft', '');

    return parseFloat(heightString);
};

const getSwellPeriod = (row) => {
    const periodString = $($('.background-gray-lighter', row)[1])
        .text()
        .replace('s', '');

    return parseInt(periodString);
};

const getWindSpeedInKnots = (row) => {
    const windSpeedString = $('.table-forecast-wind .text-right', row).text();

    const mphToKnots = 0.868976;
    return round(parseInt(windSpeedString) * mphToKnots);
};

const getRating = (sixAMRow) => {
    const ratingRow = $('.table-forecast-rating', sixAMRow);

    const activeStars = $('.rating .active', ratingRow).length;
    const inactiveStars = $('.rating .inactive', ratingRow).length;
    return { activeStars, inactiveStars };
};

const mswURLs = {
    'Dee Why': 'https://magicseaweed.com/Dee-Why-Point-Surf-Report/999/',
    'Curl Curl': 'https://magicseaweed.com/Curl-Curl-Surf-Report/1000/',
    'Freshwater': 'https://magicseaweed.com/Freshwater-Surf-Report/4997/',
    'Manly': 'https://magicseaweed.com/Sydney-Manly-Surf-Report/526/',
    'Bondi': 'https://magicseaweed.com/Sydney-Bondi-Surf-Report/996/',
    'Tamarama': 'https://magicseaweed.com/Tamarama-Beach-Surf-Report/5402/',
    'Bronte': 'https://magicseaweed.com/Bronte-Beach-Surf-Report/4579/',
};
