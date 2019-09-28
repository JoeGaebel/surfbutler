const { getCurrentTimestamp } = require('./clock');

exports.getCurrentEntry = (timeEntries) => {
    const currentTimestamp = getCurrentTimestamp();
    return this.getClosest(timeEntries, currentTimestamp);
};

exports.getTomorrowMorning = (timeEntries) => {
    const tomorrowMorning = new Date();
    tomorrowMorning.setDate(new Date(getCurrentTimestamp()).getDate() +1);
    tomorrowMorning.setHours(6,0,0);
    return this.getClosest(timeEntries, tomorrowMorning);
};

exports.getMorningWeather = (weatherEntries, sunrise) => {
    const morningWeatherIndex = getClosestElementIndex(weatherEntries, sunrise);
    let morningWeather = weatherEntries[morningWeatherIndex];

    for (let i = morningWeatherIndex; i < weatherEntries.length; i++) {
        if (!weatherEntries[i].condition.includes('NIGHT')) {
            morningWeather = weatherEntries[i];
            break;
        }
    }
    return morningWeather;
};

exports.getClosest = (timeEntries, time) => {
    let closestElement = timeEntries[0];
    let smallestTimestampDelta = Infinity;

    timeEntries.forEach(element => {
        if (Math.abs(time - element.timestamp) < smallestTimestampDelta) {
            closestElement = element;
            smallestTimestampDelta = Math.abs(time - element.timestamp);
        }
    });

    return closestElement;
};

const getClosestElementIndex = (timeEntries, time) => {
    let closestElementIndex = 0;
    let smallestTimestampDelta = Infinity;

    for (let i = 0; i < timeEntries.length; i++) {
        if (Math.abs(time - timeEntries[i].timestamp) < smallestTimestampDelta) {
            closestElementIndex = i;
            smallestTimestampDelta = Math.abs(time - timeEntries[i].timestamp);
        }
    }
    return closestElementIndex;
};
