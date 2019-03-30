exports.convertWeather = (condition) => {
    switch (condition) {
        case 'CLEAR_NO_RAIN':
            return '☀️';
        case 'PARTLY_CLOUDY_NO_RAIN':
        case 'MOSTLY_CLEAR_NO_RAIN':
            return '🌤️';
        case 'MOSTLY_CLOUDY_NO_RAIN':
            return '⛅';
        case 'OVERCAST_NO_RAIN':
            return '☁️';
        case 'MOSTLY_CLOUDY_RAIN':
            return '🌦';
        case 'OVERCAST_RAIN':
        case 'CLEAR_RAIN':
            return '🌧';
        case 'NIGHT_CLEAR_NO_RAIN':
        case 'NIGHT_PARTLY_CLOUDY_NO_RAIN':
        case 'NIGHT_MOSTLY_CLEAR_NO_RAIN':
        case 'NIGHT_OVERCAST_RAIN':
        case 'NIGHT_PARTLY_CLOUDY_RAIN':
        case 'NIGHT_OVERCAST_NO_RAIN':
            return '✨';
        default:
            return condition;
    }
};

exports.convertDirection = (direction) => {
    if (direction > 78.75 && direction <= 101.25) {
        // E
        return '⬅️';
    } else if (direction > 168.75 && direction <= 191.25) {
        // S
        return '⬆️';
    } else if (direction > 258.75 && direction <= 281.25) {
        // W
        return '➡️';
    } else if ((direction >= 0 && direction <= 11.25) || (direction > 348.75 && direction <= 360)) {
        // N
        return '⬇️';
    } else if (direction > 11.25 && direction <= 78.75) {
        // NNE, NE, ENE
        return '↙️';
    } else if (direction > 101.25 && direction <= 168.75) {
        // SE, SSE, ESE
        return '↖️';
    } else if (direction > 191.25 && direction <= 258.75) {
        // SSW, SW, WSW
        return '↗️';
    } else if (direction > 281.25 && direction <= 348.75) {
        // NW, NNW, WNW
        return '↘️';
    } else {
        return  direction;
    }
};