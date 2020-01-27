const rp = require('request-promise');
const $ = require('cheerio');
const { BeachData } = require('./BeachData');

exports.getBeachData = async (spotName) => {
    const urlPart = urlMap[spotName];
    try {
        const response = await rp(`https://www.surf-forecast.com/breaks/${ urlPart }/forecasts/data?&parts=all&period_types=t,h&forecast_duration=48h`);
        const tableBody = JSON.parse(response).period_types.t.parts.basic.content;

        const htmlDocument = `<html>
            <body>
                <table>
                    ${ tableBody }
                </table>        
            </body>
        </html>`;

        const tomorrowsFiveAMStar = $(tomorrowsFiveAMStarSelector, htmlDocument);
        const stars = parseInt(tomorrowsFiveAMStar[0].attribs.alt);

        return new BeachData({
            rating: { string: '★'.repeat(stars), meta: { stars } },
            name: spotName,
            dataSource: 'surfforecast'
        });
    } catch (e) {
        return new BeachData({
            rating: { string: '', meta: { stars: NaN } },
            name: spotName,
            dataSource: 'surfforecast'
        });
    }
};

const urlMap = {
    'Dee Why': 'Dee-Why-Point',
    'Curl Curl': 'Curl-Curl',
    'Freshwater': 'Freshwater',
    'Manly': 'Manly',
    'Bondi': 'Bondi-Beach',
    'Tamarama': 'Tamarama-Reef',
    'Bronte': 'Bronte-Beach',
};

const tomorrowsFiveAMStarSelector = 'tbody > tr.forecast-table__row.forecast-table-rating > td:nth-child(8) > img';