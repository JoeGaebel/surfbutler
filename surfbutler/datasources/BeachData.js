class BeachData {
    constructor({
                    heightInFeet,
                    swellHeight,
                    period,
                    swellDirection,
                    name,
                    weatherEmoji,
                    windSpeed,
                    windDirection,
                    rating,
                    temperature,
                    sunriseTime,
                    tideType,
                }) {
        this.heightInFeet = heightInFeet;
        this.period = period;
        this.swellDirection = swellDirection;
        this.name = name;
        this.swellHeight = swellHeight;
        this.weatherEmoji = weatherEmoji;
        this.windSpeed = windSpeed;
        this.windDirection = windDirection;
        this.rating = rating;
        this.temperature = temperature;
        this.sunriseTime = sunriseTime;
        this.tideType = tideType;
    }
}

exports.BeachData = BeachData;