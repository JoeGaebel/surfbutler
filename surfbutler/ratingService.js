const rp = require('request-promise');
const $ = require('cheerio');
const moment = require('moment-timezone');

exports.getRating = async (spotName) => {
    const url = mswURLs[spotName];
    const html = await rp(url);

    const tomorrowsDate = moment.tz('Australia/Sydney').add(1, 'day').format('DDMM');
    const ratingRow = $(`tr[data-date$="${ tomorrowsDate }"] .table-forecast-rating`, html)[2];

    const activeStars = $('.rating .active', ratingRow).length;
    const inactiveStars = $('.rating .inactive', ratingRow).length;

    return `${ '★'.repeat(activeStars) }${ '☆'.repeat(inactiveStars) }`;
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
