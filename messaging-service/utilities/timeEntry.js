const { getCurrentTimestamp } = require('./clock');

exports.getCurrentEntry = (timeEntries) => {
    const currentTimestamp = getCurrentTimestamp();
    return getClosest(timeEntries, currentTimestamp);
};

exports.getTomorrowMorningsEntry = (timeEntries) => {
    const tomorrowMorning = new Date();
    tomorrowMorning.setDate(new Date(getCurrentTimestamp()).getDate() +1);
    tomorrowMorning.setHours(6,0,0);
    return getClosest(timeEntries, tomorrowMorning);
};

function getClosest (timeEntries, time) {
    let closestElement = timeEntries[0];
    let smallestTimestampDelta = Infinity;

    timeEntries.forEach(element => {
        if (Math.abs(time - element.timestamp) < smallestTimestampDelta) {
            closestElement = element;
            smallestTimestampDelta = Math.abs(time - element.timestamp);
        }
    });

    return closestElement;
}