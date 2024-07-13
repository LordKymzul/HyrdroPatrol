"use server";


export async function getLatLongForCity(city: string) {
    try {
        const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city + ", USA")}&key=${process.env.GOOGLEAPIKEY}`;
        const geocodeResponse = await fetch(geocodeURL);

        if (!geocodeResponse.ok) {
            throw new Error(`Geocoding request failed with status ${geocodeResponse.status}`);

        }
        const geocodeData = await geocodeResponse.json();

        console.log(geocodeData);

        if (geocodeData.results && geocodeData.results.length > 0) {
            const { lat, lng } = geocodeData.results[0].geometry.location;
            console.log(lat, lng);
            return {
                status: geocodeResponse.status,
                value: {
                    lat,
                    lng
                }
            }
        } else {
            return {
                status: geocodeResponse.status,
                value: null
            };
        }

    } catch (error) {
        console.error('Error fetching geocode data:', error);
        throw error; // Re-throw the error after logging it
    }
}