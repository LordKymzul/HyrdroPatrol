"use server";

//        'https://api.weatherapi.com/v1/current.json?key=${CustomString.weatherKey}&q=${locationEntity.latitude},${locationEntity.longitude}&days=7&aqi=no'));

export const getCurrentWeather = async () => {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPIKEY}&q=3.221806,101.725659&days=7&aqi=no`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: "no-cache"
        });

        const jsonData = await response.json();

        if (!response.ok) {
            return {
                value: "Failed to fetch weather data",
                status: 500
            }
        }

        return {
            value: jsonData,
            status: 200
        }

    } catch (e) {
        return {
            value: "Internal Server Error",
            status: 500
        }
    }
}