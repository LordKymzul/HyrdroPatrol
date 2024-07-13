"use client"

import { Battery, Undo } from "lucide-react";
import { Slider } from "@/components/ui/slider"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { GoogleMap, useJsApiLoader, MarkerF, InfoBoxF, InfoWindowF, PolygonF } from '@react-google-maps/api';
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { getLatLongForCity } from "@/app/action/location-action";
import { SearchButton } from "@/app/components/button/search-button";
import { GOOGLEAPIKEY } from "@/lib/secret";
import { Button } from "@/components/ui/button";
import { TLatLng, TPlace, listPlace } from "@/app/lib/types";



const listRealTimeView: any[] = [
    {
        title: 'Route No',
        value: 1
    },
    {
        title: 'Est. Finish',
        value: 24
    },
    {
        title: 'Est. Flight Distance',
        value: 200
    },
    {
        title: 'Battery %',
        value: 80
    },
    {
        title: 'Flight Time',
        value: 40
    }
]



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




export default function MapViewPage() {

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: GOOGLEAPIKEY!,
        libraries: ["core", "maps", "places", "marker"]
    })

    const [places, setPlaces] = useState<TPlace[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<TPlace | null>(null);
    const [latlng, setLatLng] = useState<TLatLng | null>(null);
    const [polylines, setPolylines] = useState<TLatLng[]>([]);
    /*s const [position, setPosition] = useState({
         lat: places[0].latitude,
         lng: places[0].longtitude
     });*/

    useEffect(() => {
        setTimeout(() => {
            setPlaces([...listPlace]);
        }, 3000);
    }, []);


    const handleSearch = async (formData: FormData) => {
        const cityName = formData.get('name') as string;

        const result = await getLatLongForCity(cityName);
        if (result.value === null) {
            toast.error('Error');
            return;
        }

        setLatLng(result.value);
    }

    const handleMapTap = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) {
            toast.error("Error to tap");
            return;
        }

        const tappedLatLng: TLatLng = {
            lat: e.latLng?.lat(),
            lng: e.latLng?.lng()
        }
        setPolylines(prevPoylines => [...prevPoylines, tappedLatLng])
        console.log(polylines.length);
    }

    const handleMapTapUndo = () => {
        if (polylines.length === 0) {
            toast.error("Please select your field");
            return;
        }
        const updatedPolylines = polylines.slice(0, -1);
        setPolylines(updatedPolylines);
    }


    return (
        <form >
            <div className="flex flex-col w-full gap-5 px-8 py-5">
                <div className="flex items-center gap-x-4">
                    <Input id="name" name="name" placeholder="Search City" />
                    <SearchButton />
                </div>
                <div className="flex justify-end">
                    <Button className="w-fit" >
                        <Undo onClick={(e) => {
                            e.preventDefault();
                            handleMapTapUndo();
                        }} />
                    </Button>
                </div>

                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        center={latlng === null ? center : latlng}
                        zoom={15}
                        onClick={(e) => {
                            handleMapTap(e)
                        }}

                    >
                        {
                            polylines.map((eachData) => {
                                return (
                                    <MarkerF
                                        key={`${eachData.lat}-${eachData.lng}`}
                                        position={{ lat: eachData.lat, lng: eachData.lng }}
                                        icon={{
                                            url: "https://img.icons8.com/?size=100&id=K6SoUrYEBeeS&format=png&color=000000",
                                            scaledSize: new window.google.maps.Size(30, 30) // Specify the size of the icon

                                        }}
                                        animation={google.maps.Animation.BOUNCE} />
                                )
                            })
                        }

                        {
                            polylines.length !== 0 &&
                            (
                                <PolygonF
                                    key={"polygonID"}
                                    paths={polylines}
                                    options={{
                                        fillColor: "#00ff00", // Green color
                                        strokeColor: "#000000", // Black stroke color
                                        strokeOpacity: 1, // Full opacity for the stroke
                                        strokeWeight: 2, // Stroke weight
                                        fillOpacity: 0.5 // Opacity of the fill
                                    }}
                                />
                            )
                        }
                        {selectedPlace && (
                            <InfoWindowF
                                position={{ lat: selectedPlace.latitude, lng: selectedPlace.longtitude }}
                                onCloseClick={() => setSelectedPlace(null)}
                            >
                                <div>
                                    <h3>{selectedPlace.name}</h3>
                                    <p>{selectedPlace.address}</p>
                                </div>
                            </InfoWindowF>
                        )}
                    </GoogleMap>
                )}
                <BuildMapDrone />
            </div>
        </form>
    )
}

function BuildMapDrone() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4">

            <img src="/dummymap.png"
                className=" w-full h-full"
                alt="air" />

            <div className="flex flex-col gap-4 rounded-md border p-4 h-full w-full ">
                <section className="flex items-center gap-x-4">
                    <p className="font-semibold text-sm">Zetten Drone</p>
                    <img src="/droneimage.png"
                        className="w-10 h-5 object-cover"
                        alt="air" />
                </section>

                <section className="flex flex-col gap-2 ">
                    <p className="font-semibold text-xs">Battery</p>
                    <div className="flex border rounded-md p-2 justify-between">
                        <section className="flex items-center">
                            <Battery className="h-5 w-5 mr-2" />
                            <p className="font-medium text-xs">50%</p>
                        </section>
                        <section className="flex items-center">
                            <p className="font-medium text-xs">27C</p>
                        </section>
                    </div>
                </section>

                <section className="flex flex-col gap-2 ">
                    <p className="font-semibold text-xs">Altitud Adjust</p>
                    <div className="flex border rounded-md p-4">
                        <Slider defaultValue={[33]} max={100} step={1} />
                        <p className="font-medium text-xs ml-2">200</p>
                    </div>
                </section>
            </div>

        </div>
    )
}

function BuildTable() {
    return (
        <Table className="rounded-md p-4 border">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Route No</TableHead>
                    <TableHead>Est. Finish</TableHead>
                    <TableHead>Est. Flight Distance</TableHead>
                    <TableHead className="text-right">Battery</TableHead>
                    <TableHead className="text-right">Flight Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">1</TableCell>
                    <TableCell>24</TableCell>
                    <TableCell>200</TableCell>
                    <TableCell className="text-right">80%</TableCell>
                    <TableCell className="text-right">40</TableCell>
                </TableRow>
            </TableBody>
        </Table>

    )
}