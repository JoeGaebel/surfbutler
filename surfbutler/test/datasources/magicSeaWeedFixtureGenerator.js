const { getFile } = require('../testUtilities/getFile');
const moment = require('moment');
const cheerio = require('cheerio');
const assert = require('assert');

const generateFixture = ({ withSingleWaveHeight, stars } = {}) => {
    const dayFixture = getFile('./test/datasources/magicSeaWeedDayFixture.html');

    const todaysDate = moment.tz('Australia/Sydney').format('DDMM');
    const tomorrowsDate = moment.tz('Australia/Sydney').add(1, 'day').format('DDMM');
    const dayAfterDate = moment.tz('Australia/Sydney').add(2, 'day').format('DDMM');

    const todayTable = getWrongDayTable(dayFixture, todaysDate);
    let tomorrowTable = getTomorrowTable(dayFixture, tomorrowsDate, stars);
    const dayAfterTable = getWrongDayTable(dayFixture, dayAfterDate);

    if (withSingleWaveHeight) {
        tomorrowTable = replaceDataColumnInCorrectDayAndTime(tomorrowTable, '.table-forecast-breaking-wave', singleWaveHeightDOM);
    }

    return `
        <html>
            <table>
                    ${ todayTable }
                    ${ tomorrowTable }
                    ${ dayAfterTable }
            </table>
        </html>
    `;
};

const singleWaveHeightDOM = `
<td class="text-center background-info table-forecast-breaking-wave" style="background-color: hsl(196, 78.9%, 53.383333333333%)">
    <span class="h3 font-sans-serif heavy nomargin text-white">2<small class="unit">ft</small></span>
</td>
`;

const replaceDataColumnInCorrectDayAndTime = (fixture, columnSelector, columnDOM) => {
    const $ = cheerio.load(`<html>
        <body>
            <table>
                ${ fixture }
            </table>
        </body>
    </html>`);

    $(columnSelector).replaceWith(columnDOM);

    return $('table').html();
};

const wrongDayRating = `
<!-- Wrong Day Rating -->
<ul class="rating clearfix">
    <li class="active"><i class="glyphicon glyphicon-star"></i></li>
    <li class="active"><i class="glyphicon glyphicon-star"></i></li>
    <li class="active"><i class="glyphicon glyphicon-star"></i></li>
    <li class="active"><i class="glyphicon glyphicon-star"></i></li>
    <li class="active"><i class="glyphicon glyphicon-star"></i></li>
</ul>`;

const correctDayCorrectTimeRating = `
<!-- Correct Day, Correct Time Rating -->
<ul class="rating clearfix">
    <li class="active "><i class="glyphicon glyphicon-star"></i></li>
    <li class="active"><i class="glyphicon glyphicon-star"></i></li>
    <li class="inactive"><i class="glyphicon glyphicon-star"></i></li>
    <li class="placeholder"><i class="glyphicon glyphicon-star"></i></li>
    <li class="placeholder"><i class="glyphicon glyphicon-star"></i></li>
</ul>`;

const generateRatingFromStars = ({ active, inactive }) => {
    assert(inactive + active < 6, 'you must send 5 or less stars');

    const activeStars = '<li class="active "><i class="glyphicon glyphicon-star"></i></li>'.repeat(active);
    const inactiveStars = '<li class="inactive"><i class="glyphicon glyphicon-star"></i></li>'.repeat(inactive);
    const placeHolderStars = '<li class="placeholder"><i class="glyphicon glyphicon-star"></i></li>'.repeat(5 - active - inactive);

    return `
        <!-- Correct Day, Correct Time Custom Star Rating -->
        <ul class="rating clearfix">
            ${ activeStars }
            ${ inactiveStars }
            ${ placeHolderStars }
        </ul>
    `;
};


const getWrongDayTable = (fixture, date) => fixture
    .replace(/RATING_ROW/g, wrongDayRating)
    .replace(/DATE/g, date);

const getTomorrowTable = (fixture, date, stars) => {
    let rating;

    if (stars) {
        rating = generateRatingFromStars(stars);
    } else {
        rating = correctDayCorrectTimeRating;
    }

    const withCorrectRowInjected = replaceAt(
        fixture, /RATING_ROW/g, rating, 0
    );

    return withCorrectRowInjected
        .replace(/DATE/g, date);
};

const replaceAt = (string, regexp, repl, at) => {
    let occurrence = -1;
    return string.replace(regexp, (match) => {
        occurrence++;
        if (occurrence === at) {
            return repl;
        }
        return match;
    });
};

exports.generateFixture = generateFixture;
exports.replaceDataColumnInCorrectDayAndTime = replaceDataColumnInCorrectDayAndTime;