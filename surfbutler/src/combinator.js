const { round } = require('./utilities/numberUtils');
const { BeachData } = require('./datasources/BeachData');

exports.getCombinedData = (...beachDatas) => {
    alertForRatingDifference(beachDatas);
    const combinedBeachData = averageData(beachDatas);
    setSurflineData(beachDatas, combinedBeachData);

    return combinedBeachData;
};

const fieldsToCombine = [
    'waveHeightInFeet',
    'swellHeightInFeet',
    'swellPeriod',
    'windSpeedInKnots',
    'rating'
];

const averageData = (beachDatas) => {
    const fieldExclusions = initializeFieldExclusions();
    const combinedBeachData = initializeBeachData();

    beachDatas.forEach(beachData => {
        fieldsToCombine.forEach(field => {
            const fieldData = beachData[field];

            if (!isFinite(fieldData)) {
                fieldExclusions[field] += 1;
            } else {
                combinedBeachData[field] += fieldData;
            }
        });
    });

    fieldsToCombine.forEach(field => {
        const numberOfDataSets = beachDatas.length - fieldExclusions[field];

        if (numberOfDataSets === 0) {
            combinedBeachData[field] = 0;
            console.error(`NO DATA FOUND FOR ${ field } ACROSS ALL DATA SOURCES`);
        } else {
            combinedBeachData[field] = round(combinedBeachData[field] / numberOfDataSets, 1);
        }
    });

    return combinedBeachData;
};

const initializeBeachData = () =>
    fieldsToCombine.reduce((beachData, field) => {
        beachData[field] = 0.0;
        return beachData;
    }, new BeachData({}));

const initializeFieldExclusions = () =>
    fieldsToCombine.reduce((exclusions, field) => {
        exclusions[field] = 0;
        return exclusions;
    }, {});

const surflineFields = [
    'tideType',
    'sunriseTime',
    'temperature',
    'weatherEmoji',
    'swellDirectionEmoji',
    'windDirectionEmoji'
];

const setSurflineData = (beachDatas, combinedBeachData) => {
    const surflineData = beachDatas.find(data => data.dataSource === 'surfline');

    surflineFields.forEach(field => {
        combinedBeachData[field] = surflineData[field];
    });
};

const alertForRatingDifference = (beachDatas) => {
    const mswData = beachDatas.find(data => data.dataSource === 'msw');
    const surfForecastData = beachDatas.find(data => data.dataSource === 'surfforecast');

    if (Math.abs(mswData.rating - surfForecastData.rating) >= 3) {
        console.error(`MSW rating ${ mswData.rating } is very different than SurfForecast rating ${ surfForecastData.rating }`);
    }
};