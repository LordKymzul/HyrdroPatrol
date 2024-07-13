export interface WeatherJson {
    location: {
        name: string;
        localtime: string;
    };
    current: {
        temp_c: number;
        condition: {
            icon: string;
            text: string;
        };
        humidity: number;
    };
}

export class WeatherEntity {
    weatherLocation: string;
    weatherTemp: number;
    weatherIcon: string;
    weatherCondition: string;
    weatherHumidity: number;
    weatherTime: string;

    constructor(
        weatherLocation: string,
        weatherTemp: number,
        weatherIcon: string,
        weatherCondition: string,
        weatherHumidity: number,
        weatherTime: string
    ) {
        this.weatherLocation = weatherLocation;
        this.weatherTemp = weatherTemp;
        this.weatherIcon = weatherIcon;
        this.weatherCondition = weatherCondition;
        this.weatherHumidity = weatherHumidity;
        this.weatherTime = weatherTime;
    }

    static fromJson(json: Partial<WeatherJson>): WeatherEntity {
        return new WeatherEntity(
            json.location?.name ?? 'Ohaio',
            json.current?.temp_c ?? 0.0,
            json.current?.condition?.icon ?? 'defaultIconURL', // Replace with your default URL
            json.current?.condition?.text ?? 'null',
            json.current?.humidity ?? 0,
            json.location?.localtime ?? 'unknownTime'
        );
    }
}

// Example usage:
const jsonData = {
    location: {
        name: "New York",
        localtime: "2024-05-26 10:00"
    },
    current: {
        temp_c: 22.5,
        condition: {
            icon: "http://example.com/icon.png",
            text: "Sunny"
        },
        humidity: 50
    }
};

const weather = WeatherEntity.fromJson(jsonData);
console.log(weather);
