"use client"

import { MainHeader } from "@/app/components/header/main-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Delete, Loader2, Trash, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import Multiselect from 'multiselect-react-dropdown';
import Link from "next/link";
import { SubmitButton } from "@/app/components/button/submit-button";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { storage } from "@/app/lib/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { postDrone } from "@/app/action/drone-action";
import { redirect } from "next/navigation";
import { Library } from "@googlemaps/js-api-loader";
import { Autocomplete, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLEAPIKEY } from "@/lib/secret";


const libs: Library[] = ["core", "maps", "places", "marker"];

export default function CreateDronePage() {

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: GOOGLEAPIKEY!,
        libraries: ["core", "maps", "places", "marker"]
    })


    const [file, setFile] = useState<File | null>(null);
    const [fileURL, setFileURL] = useState<string | null>(null);

    //Google Map
    const [autoComplete, setAutoComplete] = useState<google.maps.places.Autocomplete>();


    const handleFileChange = (acceptedFiles: any) => {
        if (!acceptedFiles || acceptedFiles.length === 0) {
            toast.error("Please select a file");
            return;
        }

        const file = acceptedFiles[0];

        if (!file.type.startsWith('image/')) {
            toast.error("File must be in Image Format.");
            return;
        }

        setFile(file);
        setFileURL(URL.createObjectURL(file));
    };

    const uploadImageToFirebaseStorage = async () => {
        if (!file || !fileURL) {
            toast.error("Please select a file");
            return;
        }
        try {
            const avatarURLName = `${file.name + new Date().getTime().toLocaleString()}`;
            const imageRef = ref(storage, `images/${avatarURLName}`);
            const snapshot = await uploadBytes(imageRef, file);
            const avatarURL = await getDownloadURL(snapshot.ref);
            return {
                avatarURL, avatarURLName
            };
        } catch (e) {
            return null;
        }

    }

    const handleClientPostDrone = async (formData: FormData) => {
        const uploadResult = await uploadImageToFirebaseStorage();

        if (!uploadResult) {
            toast.error("Something was error uploading to firebase storage");
            return;
        }

        if (!autoComplete) {
            toast.error("Unable to select place.");
            return;
        }
        const place = autoComplete.getPlace();

        formData.append("avatarURL", uploadResult.avatarURL);
        formData.append("avatarURLName", uploadResult.avatarURLName);
        formData.append("locationName", place.formatted_address?.toString() ?? "");
        formData.append("locationLat", place.geometry?.location?.lat().toString() ?? "");
        formData.append("locationLng", place.geometry?.location?.lng().toString() ?? "");

        const droneResult = await postDrone(formData);
        if (droneResult.status < 210) {
            toast.success(droneResult.value);
        } else {
            toast.error(droneResult.value);

        }

        redirect('/dashboard');
    }

    const handleOnPlaceChanged = () => {
        if (autoComplete) {
            const place = autoComplete.getPlace();
            console.log("Location: " + place.formatted_address?.toString());
            console.log("Latitude: " + place.geometry?.location?.lat().toString());
            console.log("Longitude: " + place.geometry?.location?.lng().toString());
        }
    };

    const onLoad = (autoComplete: google.maps.places.Autocomplete) => {
        setAutoComplete(autoComplete);
    }


    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center w-full">
                <Loader2 className="animate-spin m-2" />
            </div>
        )
    }
    return (

        <div className="flex flex-col w-full px-8 py-5 gap-5">
            <MainHeader title="Create New Drone" desc="Create your new drone by filling in the blanks." />

            <form action={handleClientPostDrone} className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-x-4">
                    <section className="flex flex-col gap-2 w-full">
                        <BuildFormRequiredLabel labelTitle="Drone Name" />
                        <Input id="droneName" name="droneName" placeholder="DGI Drone" />
                    </section>

                    <section className="flex flex-col gap-2 w-full">
                        <BuildFormRequiredLabel labelTitle="Drone Tag" />
                        <Input id="droneTag" name="droneTag" placeholder="Threat Detection" />
                    </section>
                </div>

                <div className="flex flex-row items-center gap-x-4">
                    <section className="flex flex-col gap-2 w-full">
                        <BuildFormRequiredLabel labelTitle="Drone Brand" />
                        <Input id="droneBrand" name="droneBrand" placeholder="NXP" />
                    </section>

                    <section className="flex flex-col gap-2 w-full">
                        <BuildFormRequiredLabel labelTitle="Drone Model" />
                        <Input id="droneModel" name="droneModel" placeholder="1235" />
                    </section>

                </div>


                <div className="flex flex-col gap-3">
                    <BuildFormRequiredLabel labelTitle="Drone Image" />
                    <Dropzone onDrop={acceptedFiles => {
                        handleFileChange(acceptedFiles);
                    }}>
                        {({ getRootProps, getInputProps }) => (
                            fileURL === null || file === null ? (
                                <section>
                                    <div {...getRootProps()} className="flex flex-col justify-center items-center border gap-2 rounded-lg h-[200px]">
                                        <input {...getInputProps()} />
                                        <Upload />
                                        <p className="text-muted-foreground text-xs">Drag & drop annual report, or click to select files.</p>
                                    </div>
                                </section>
                            ) : (
                                <div className="flex gap-4 items-center">
                                    {file.type.startsWith("image/") ? (
                                        <div className="rounded-lg overflow-hidden w-80 relative border">
                                            <Trash className="absolute top-0 right-0 m-4 w-4 h-4 justify-end" onClick={() => {
                                                setFile(null);
                                                setFileURL("");
                                            }} />
                                            <img className="object-contain" src={fileURL} alt={file.name} />
                                        </div>
                                    ) : (
                                        <div className="rounded-lg overflow-hidden w-80 relative">
                                            <video className="object-contain" src={fileURL} autoPlay loop muted />
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </Dropzone>
                </div>

                <div className="flex flex-col gap-3">
                    <Label>Drone Location</Label>
                    <Autocomplete
                        onLoad={onLoad}
                        onPlaceChanged={handleOnPlaceChanged}
                        fields={['geometry.location', 'formatted_address']}

                    >
                        <Input placeholder="Enter your address" />
                    </Autocomplete>
                </div>


                <div className="flex flex-row items-center justify-end gap-x-2">
                    <Button variant={"outline"} asChild>
                        <Link href={'/dashboard'}>
                            Cancel
                        </Link>
                    </Button>

                    <SubmitButton buttonTitle="Save" buttonVariant={"default"} />
                </div>
            </form>


        </div >
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