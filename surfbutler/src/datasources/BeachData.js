class BeachData {
    constructor({
                    waveHeightInFeet,
                    swellHeightInFeet,
                    swellPeriod,
                    swellDirectionEmoji,
                    name,
                    weatherEmoji,
                    windSpeedInKnots,
                    windDirectionEmoji,
                    rating,
                    temperature,
                    sunriseTime,
                    tideType,
                    dataSource
                }) {
        this.waveHeightInFeet = waveHeightInFeet;
        this.swellPeriod = swellPeriod;
        this.swellDirectionEmoji = swellDirectionEmoji;
        this.name = name;
        this.swellHeightInFeet = swellHeightInFeet;
        this.weatherEmoji = weatherEmoji;
        this.windSpeedInKnots = windSpeedInKnots;
        this.windDirectionEmoji = windDirectionEmoji;
        this.rating = rating;
        this.temperature = temperature;
        this.sunriseTime = sunriseTime;
        this.dataSource = dataSource;
        this.tideType = tideType;
    }
}

exports.BeachData = BeachData;