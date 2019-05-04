const { getCurrentTimestamp } = require('./clock');

exports.getClosest = (timeEntries, time) => {
    let closestElement = timeEntries[0];
    let smallestTimestampDelta = Infinity;

    timeEntries.forEach(element => {
        if (time - element.timestamp < smallestTimestampDelta) {
            closestElement = element;
            smallestTimestampDelta = Math.abs(time - element.timestamp);
        }
    });

    return closestElement;
};

exports.getClosest = (timeEntries) => {
    const currentTimestamp = getCurrentTimestamp();
    return this.getClosest(timeEntries, currentTimestamp);
};
