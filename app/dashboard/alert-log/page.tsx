"use client"

import { MainHeader } from "@/app/components/header/main-header";
import { convertDate } from "@/app/lib/util";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, EllipsisVertical, User } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SelectForm } from "@/app/components/select/select";
import { useState } from "react";
import toast from "react-hot-toast";

const locations: any[] = [
    {
        id: "ALL",
        name: "All"
    },
    {
        id: "DK",
        name: "Dato Keramat"
    },
    {
        id: "SB",
        name: "Sungai Besi"
    },
    {
        id: "MD",
        name: "Mutiara Damansara"
    },

]



type TAlert = {
    threat: string
    location: string
    date: Date
    image: string
}

const listAlert: TAlert[] = [
    {
        threat: "Pipe Leakage",
        location: "Datuk Keramat",
        date: new Date(),
        image: "/alert/IMG_1873.JPG"
    },
    {
        threat: "Pipe Leakage",

        location: "Datuk Keramat",
        date: new Date(),
        image: "/alert/IMG_1874.JPG"
    },
    {
        threat: "Pipe Leakage",

        location: "Mutiara Damansara",
        date: new Date(),
        image: "/alert/IMG_1875.JPG"
    },
    {
        threat: "Landslide",

        location: "Datuk Keramat",
        date: new Date(),
        image: "/alert/IMG_9412.JPG"
    },
    {
        threat: "Pipe Leakage",

        location: "Datuk Keramat",
        date: new Date(),
        image: "/alert/IMG_9414.JPG"
    },
    {
        threat: "Construction",

        location: "Mutiara Damansara",
        date: new Date(),
        image: "/alert/IMG_9413.JPG"
    }
]


export default function AlertLogPage() {

    const [currentLocation, setCurrentLocation] = useState("All");

    const handleLocationChange = (selectedLocation: string) => {
        setCurrentLocation(selectedLocation);
    }

    return (
        <div className="flex flex-col w-full gap-5 px-8 py-5">
            <MainHeader title="Alert Log" desc="Here is your overview for alert log." />
            <div className="flex flex-row items-center justify-between">
                <Input id="search" name="search" type="text" placeholder="Search Threat" className="w-full md:w-1/2" />

            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {
                    listAlert.map((eachAlert, index) => {
                        if (eachAlert.location === currentLocation || currentLocation === "All") {
                            return <BuildLogCard key={index} eachAlert={eachAlert} />;
                        }
                        return <div></div>;
                    })
                }

            </div>

        </div>
    )
}

function BuildLogCard({ eachAlert }: { eachAlert: TAlert }) {
    return (

        <div className="flex flex-col rounded-lg shadow border p-3">
            <div className="flex items-center justify-between">
                <section className="flex flex-col">
                    <p className="text-sm xl:text-base font-medium">{eachAlert.threat}</p>
                    <p className="text-xs font-light">{eachAlert.location}</p>
                </section>
                <Button size={"icon"} variant={"ghost"}>
                    <EllipsisVertical className="h-4 w-4" />
                </Button>
            </div>
            <img src={eachAlert.image}
                className="mt-2 w-full h-full rounded-md object-cover"
                alt="air" />

            <div className="flex items-center justify-between text-xs font-light mt-4">
                <section className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <p >{convertDate(eachAlert.date)}</p>
                </section>

            </div>
        </div>
    )
}




