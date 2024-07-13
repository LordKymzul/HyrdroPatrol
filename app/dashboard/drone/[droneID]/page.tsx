"use client"

import { getSingleDrone } from "@/app/action/drone-action";
import { MainHeader } from "@/app/components/header/main-header"
import { TDrone, TLatLng, TPathLatLng, TPlace } from "@/app/lib/types";
import { Label } from "@/components/ui/label";
import { GOOGLEAPIKEY } from "@/lib/secret"
import { GoogleMap, MarkerF, PolygonF, PolylineF, useJsApiLoader } from "@react-google-maps/api"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2, Trash, Undo } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { SubmitButton } from "@/app/components/button/submit-button";
import { deletePath, getSinglePath, postPath } from "@/app/action/path-action";
import { redirect } from "next/navigation";
import { getPath } from "recharts/types/shape/Curve";
import { useRouter } from "next/navigation";
import { PathTable } from "@/app/components/table/path-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



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

interface BuildSelectFormProps {
    name: string
    listData: any[]
    handleChange: (value: string) => void;
}

const listStatus = [
    {
        name: "True"
    },
    {
        name: "False"
    }
]

export default function DroneDetail({ params }: {
    params: {
        droneID: string
    }
}) {

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: GOOGLEAPIKEY!,
        libraries: ["core", "maps", "places", "marker"]
    })

    //Utils
    const router = useRouter();

    //Google Map
    const [latlng, setLatLng] = useState<TLatLng>();
    const [polylines, setPolylines] = useState<TLatLng[]>([]);
    const [pathLatLng, setPathLatLng] = useState<TPathLatLng | undefined>(undefined);
    const [paths, setPaths] = useState<TLatLng[]>([]);

    //Drone
    const [drone, setDrone] = useState<TDrone | undefined>(undefined);
    const [flyDate, setFlyDate] = React.useState<Date>(new Date());


    useEffect(() => {
        const getData = async () => {
            const response = await getSingleDrone(params.droneID);
            if (response.status > 210) {
                setDrone(undefined);
            }
            setDrone(response.value);
            const test: TLatLng = {
                lat: response.value.droneLocation.locationLat,
                lng: response.value.droneLocation.locationLng
            };
            setLatLng(test);

            const responsePath = await getSinglePath(params.droneID);
            if (responsePath.status > 210) {
                setPathLatLng(undefined);
                setPaths([]);
            } else {
                setPathLatLng(responsePath.value);
                const dronePathLatLng: TPathLatLng[] = responsePath.value.dronePathLatLng;
                setPaths(dronePathLatLng);
            }
        };

        getData();
    }, [params.droneID]);


    const handleMapTap = (e: google.maps.MapMouseEvent) => {

        if (paths.length !== 0) {
            toast.error("You already have path, Clear your path.");
            return;
        }

        if (!e.latLng) {
            toast.error("Error to tap");
            return;
        }

        const tappedLatLng: TLatLng = {
            lat: e.latLng?.lat(),
            lng: e.latLng?.lng()
        }

        setPolylines(prevPolylines => [...prevPolylines, tappedLatLng],)
    }

    const handleMapTapUndo = () => {

        if (polylines.length === 0) {
            toast.error("Please draw your line in the map.")
            return;
        }

        const updatedPolylines = polylines.slice(0, -1);
        setPolylines(updatedPolylines);

    }


    const handleClientPostPath = async () => {

        if (drone === undefined) {
            toast.error("Drone Undefined");
            return;
        }

        if (polylines.length === 0) {
            toast.error("Please select your path.")
            return;
        }

        const result = await postPath(drone?.droneID, flyDate, polylines);

        if (result.status === 201) {
            toast.success(result.value);
            redirect('/dashboard/drones');
        } else {
            toast.error(result.value);
        }

    }


    const handleClientDeletePath = async () => {

        if (drone === undefined) {
            toast.error("Drone Undefined");
            return;
        }

        if (pathLatLng === undefined) {
            toast.error("You are not create path yet.");
            return;
        }

        const result = await deletePath(pathLatLng?.pathID, drone.droneID);

        if (result.value > 210) {
            toast.error(result.value);
        } else {
            toast.success(result.value);
            router.push('/dashboard/drones');
        }
    }


    if (drone === undefined) {
        return (
            <h1>Drone with ID ${params.droneID} not found.</h1>
        )
    }

    return (

        <div className="flex flex-col gap-5 px-8 py-5 w-full">
            <div className="flex flex-row items-center justify-between">
                <MainHeader title={`Drone path for ${drone?.droneModel}`} desc="Set your drone's path here." />
                <form action={handleClientPostPath}>
                    <div className="flex flex-row items-center justify-end gap-x-2">
                        {
                            paths.length !== 0 ?
                                (
                                    <Button disabled variant={"outline"}>Already Create Path</Button>

                                )
                                :
                                (
                                    <SubmitButton buttonTitle="Save" buttonVariant={"default"} />
                                )
                        }
                    </div>
                </form>
            </div>

            {isLoaded && (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row items-center justify-between">
                        <Label>Label Path</Label>
                        <section className="flex items-center gap-x-2">
                            {
                                paths.length !== 0 && (
                                    <Button variant={"outline"} onClick={(e) => {
                                        e.preventDefault();
                                        handleClientDeletePath();
                                    }}>
                                        <Trash className="mr-2 h-4 w-4" />
                                        Clear Path
                                    </Button>
                                )
                            }

                            {
                                paths.length === 0 && (
                                    <Button onClick={(e) => {
                                        e.preventDefault();
                                        handleMapTapUndo();
                                    }}>
                                        <Undo className="mr-2 h-4 w-4" />
                                        Undo
                                    </Button>
                                )
                            }
                        </section>

                    </div>
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        center={{
                            lat: drone.droneLocation?.locationLat ?? 0,
                            lng: drone.droneLocation?.locationLng ?? 0
                        }}
                        zoom={20}
                        onClick={(e) => {
                            handleMapTap(e);
                        }}
                    >
                        {
                            paths.length !== 0 && (
                                paths.map((eachPolyline, index) => {
                                    return (
                                        <PolylineF
                                            key={`poyline-${index}-${eachPolyline.lat}-${eachPolyline.lng}`}
                                            options={{
                                                geodesic: true,
                                                path: paths,
                                                strokeColor: "#000000", // Black stroke color
                                                strokeOpacity: 1, // Full opacity for the stroke
                                                strokeWeight: 2, // Stroke weight
                                            }}
                                        />
                                    )
                                })
                            )
                        }
                        {
                            paths.length !== 0 && (
                                paths.map((eachData, index) => {
                                    return (
                                        <MarkerF
                                            key={`${eachData.lat}-${eachData.lng}-${index}`}
                                            position={{ lat: eachData.lat, lng: eachData.lng }}
                                            icon={{
                                                url: "https://img.icons8.com/?size=100&id=K6SoUrYEBeeS&format=png&color=000000",
                                                scaledSize: new window.google.maps.Size(30, 30) // Specify the size of the icon

                                            }}
                                            animation={google.maps.Animation.BOUNCE} />
                                    )
                                })
                            )
                        }
                        {
                            polylines.map((eachPolyline, index) => {
                                return (
                                    <PolylineF
                                        key={`poyline-${index}-${eachPolyline.lat}-${eachPolyline.lng}`}
                                        options={{
                                            geodesic: true,
                                            path: polylines,
                                            strokeColor: "#000000", // Black stroke color
                                            strokeOpacity: 1, // Full opacity for the stroke
                                            strokeWeight: 2, // Stroke weight
                                        }}
                                    />
                                )
                            })
                        }

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
                    </GoogleMap>
                </div>
            )}

            <div className="flex flex-row items-center justify-between gap-x-2">

                <BuildSelectForm name="Status" listData={listStatus} handleChange={() => { }} />

                <section className="flex flex-col gap-2 w-full">
                    <Label>Fly Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    "text-muted-foreground"
                                )}
                            >
                                {flyDate ? (
                                    format(flyDate, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={flyDate}
                                onSelect={(e: any) => {
                                    setFlyDate(e); // Use e instead of value
                                }}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </section>

            </div>

            <div className="flex flex-col gap-2">
                <Label>Path Table</Label>
                <PathTable paths={
                    paths.length !== 0 ? paths : polylines
                } />
            </div>
        </div>
    )

}



function BuildFormRequiredLabel({ labelTitle }: {
    labelTitle: string
}) {
    return (
        <div className="flex items-center">
            <Label>{labelTitle}</Label>
            <span className="text-red-600 ml-2">*</span>
        </div>
    )
}

function BuildSelectForm({ name, listData, handleChange }: BuildSelectFormProps) {
    return (
        <section className="flex flex-col gap-y-2 w-full">
            <Label>{name}</Label>
            <Select onValueChange={handleChange}>
                <SelectTrigger>
                    <SelectValue placeholder={name} />
                </SelectTrigger>
                <SelectContent >
                    {listData.map((eachData, index) => (
                        <SelectItem key={index} value={eachData.name}>
                            {eachData.name}
                        </SelectItem>
                    ))}

                </SelectContent>
            </Select>
        </section>
    );
}