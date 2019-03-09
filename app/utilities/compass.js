exports.toDirection = (degrees) => {
    let direction;
    if (degrees >= 0 && degrees <= 11.25) {
        direction = 'N';
    }
    if (degrees > 348.75 && degrees <= 360) {
        direction = 'N';
    }
    if (degrees > 11.25 && degrees <= 33.75) {
        direction = 'NNE';
    }
    if (degrees > 33.75 && degrees <= 56.25) {
        direction = 'NE';
    }
    if (degrees > 56.25 && degrees <= 78.75) {
        direction = 'ENE';
    }
    if (degrees > 78.75 && degrees <= 101.25) {
        direction = 'E';
    }
    if (degrees > 101.25 && degrees <= 123.75) {
        direction = 'ESE';
    }
    if (degrees > 123.75 && degrees <= 146.25) {
        direction = 'SE';
    }
    if (degrees > 146.25 && degrees <= 168.75) {
        direction = 'SSE';
    }
    if (degrees > 168.75 && degrees <= 191.25) {
        direction = 'S';
    }
    if (degrees > 191.25 && degrees <= 213.75) {
        direction = 'SSW';
    }
    if (degrees > 213.75 && degrees <= 236.25) {
        direction = 'SW';
    }
    if (degrees > 236.25 && degrees <= 258.75) {
        direction = 'WSW';
    }
    if (degrees > 258.75 && degrees <= 281.25) {
        direction = 'W';
    }
    if (degrees > 281.25 && degrees <= 303.75) {
        direction = 'WNW';
    }
    if (degrees > 303.75 && degrees <= 326.25) {
        direction = 'NW';
    }
    if (degrees > 326.25 && degrees <= 348.75) {
        direction = 'NNW';
    }
    return direction;
};