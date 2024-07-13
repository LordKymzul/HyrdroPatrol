// GoogleMapsLoader.tsx
import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { GOOGLEAPIKEY } from '@/lib/secret';

const GoogleMapsLoader = () => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script-drone-detail",
        googleMapsApiKey: GOOGLEAPIKEY!,
        libraries: ["places"]
    });

    return null; // Since this component doesn't render anything, return null
};

export default GoogleMapsLoader;
