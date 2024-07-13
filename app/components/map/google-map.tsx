import { GOOGLEAPIKEY } from '@/lib/secret';
import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect } from 'react';


const mapStyles = {
    width: '100%',
    height: '400px',
    borderRadius: '10px',
    overflow: "hidden"
};


const center = {
    lat: 3.2218,
    lng: 101.7257
};


export interface GoogleMapsProps {
    lat: number,
    lng: number;
}

export default function GoogleMaps({ lat, lng }: GoogleMapsProps) {

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: GOOGLEAPIKEY!,
        libraries: ["core", "maps", "places", "marker"]
    })

    return (
        isLoaded && (
            <GoogleMap
                mapContainerStyle={mapStyles}
                center={{
                    lat: lat,
                    lng: lng
                }}
                zoom={15}
                onClick={(e) => {

                }}
            >

            </GoogleMap>
        )
    )
}