class BeachData {
    constructor({
                    waveHeightInFeet,
                    swellHeightInFeet,
                    swellPeriod,
                    swellDirectionEmoji,
                    name,
                    weatherEmoji,
                    windSpeed,
                    windDirectionEmoji,
                    rating,
                    temperature,
                    sunriseTime,
                    tideType,
                }) {
        this.waveHeightInFeet = waveHeightInFeet;
        this.swellPeriod = swellPeriod;
        this.swellDirectionEmoji = swellDirectionEmoji;
        this.name = name;
        this.swellHeightInFeet = swellHeightInFeet;
        this.weatherEmoji = weatherEmoji;
        this.windSpeed = windSpeed;
        this.windDirectionEmoji = windDirectionEmoji;
        this.rating = rating;
        this.temperature = temperature;
        this.sunriseTime = sunriseTime;
        this.tideType = tideType;
    }
}

exports.BeachData = BeachData;