const getCurrentTimestamp = require('./clock').getCurrentTimestamp;

exports.getClosest = (timeEntries) => {
    const currentTimestamp = getCurrentTimestamp();
    let closestElement = timeEntries[0];
    let smallestTimestampDelta = Infinity;

    timeEntries.forEach(element => {
        if (currentTimestamp - element.timestamp < smallestTimestampDelta) {
            closestElement = element;
            smallestTimestampDelta = Math.abs(currentTimestamp - element.timestamp);
        }
    });

    return closestElement;
};