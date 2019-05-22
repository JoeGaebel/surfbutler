exports.toFeet = (meter) => {
    return this.round(meter * 3.28084, 1);
};

exports.round = (value, precision) => {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};