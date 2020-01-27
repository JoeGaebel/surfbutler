const { getFile } = require('../testUtilities/getFile');

exports.generateFixture = (stars) => {
    const content = getHTMLContent(stars);

    const jsonObject = { period_types: { t: { parts: { basic: { content: content } } } } };

    return JSON.stringify(jsonObject);
};

const getHTMLContent = (stars) => {
    const fixture = getFile('./test/datasources/surfForecastRatingFixture.html');
    return fixture.replace('5AM_RATING_ALT', stars);
};