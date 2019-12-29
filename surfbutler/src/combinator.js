const { BeachData } = require('./datasources/BeachData');

exports.getCombinedData = (...beachDatas) => {
    const combinedBeachData = averageData(beachDatas);

    setMagicSeaWeedData(beachDatas, combinedBeachData);
    setSurflineData(beachDatas, combinedBeachData);

    return combinedBeachData;
};

const fieldsToCombine = [
    'waveHeightInFeet',
    'swellHeightInFeet',
    'swellPeriod',
    'windSpeedInKnots'
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
        combinedBeachData[field] /= numberOfDataSets;
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

const setMagicSeaWeedData = (beachDatas, combinedBeachData) => {
    const mswData = beachDatas.find(data => data.dataSource === 'msw');
    combinedBeachData.rating = mswData.rating;
};

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