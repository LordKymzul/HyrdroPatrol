"use client"
import { Button } from "@/components/ui/button";
import { AreaChart, BarChart, Cloud, LocateIcon, LocateOffIcon, Plane, Route } from "lucide-react";
import Link from "next/link";
import DashLineChart from "../components/chart/dash-chart";
import { MainHeader } from "../components/header/main-header";

import { DashPieChart } from "../components/chart/pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";


import Papa from 'papaparse';
import toast from "react-hot-toast";
import { DashCard, DashCardProps } from "../components/card/dash-card";
import { TDrone, TDronePath } from "../lib/types";
import { getDrones } from "../action/drone-action";
import { getCurrentWeather } from "../action/weather-action";
import { WeatherEntity } from "../lib/model/weather";
import DashMidnightLineChart from "../components/chart/dash-midnight-chart";
import { DashMidnightPieChart } from "../components/chart/pie-midnight-chart";
import { getPaths } from "../action/path-action";
import { SelectForm } from "../components/select/select";


const listTime: any[] = [
    {
        name: "Daily",
    },
    {
        name: "Midnight",
    },

]

const locations: any[] = [
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

export default function DashboardPage() {

    //Data
    const [data, setData] = useState<any[]>([]);
    const [dailyPath, setDailyPath] = useState("/dk_daily.csv");
    const [midnightPath, setMidnightPath] = useState("/dk_midnight.csv");

    //Drone
    const [drones, setDrones] = useState<TDrone[]>([]);

    //Path
    const [paths, setPaths] = useState<TDronePath[]>([]);

    //Utils
    const [isMidnight, setIsMidnight] = useState(false);
    const [weatherCurrent, setWeatherCurrent] = useState<WeatherEntity | undefined>(undefined);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(isMidnight ? midnightPath : dailyPath);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }

                const reader = response.body?.getReader();
                const result = await reader?.read();
                if (!result) {
                    throw new Error("Failed to read response body");
                }

                const decoder = new TextDecoder("utf-8");
                const csvData = decoder.decode(result.value);
                const parseData = Papa.parse(csvData, {
                    header: true,
                    skipEmptyLines: true,
                }).data;

                setData(parseData);

                const droneResponse = await getDrones();
                if (droneResponse.status < 210) {
                    setDrones(droneResponse.value);
                } else {
                    setDrones([]);
                }

                const pathResponse = await getPaths();
                if (pathResponse.status < 210) {
                    setPaths(pathResponse.value);
                } else {
                    setPaths([]);
                }

                const weatherCurrentResponse = await getCurrentWeather();
                if (weatherCurrentResponse.status < 210) {
                    const jsonData = weatherCurrentResponse.value;
                    setWeatherCurrent(WeatherEntity.fromJson(jsonData));
                } else {
                    setWeatherCurrent(undefined);
                }

            } catch (error) {
                console.error("Error fetching or parsing data:", error);
                toast.error("Failed to load data");
            }
        };

        fetchData();
    }, [dailyPath, midnightPath, isMidnight]);

    const listDashData: DashCardProps[] = [
        {
            title: "Total Drone",
            content: drones.length.toString(),
            desc: "Your total drones available.",
            icon: Plane
        },
        {
            title: "Total Path",
            content: paths.length.toString(),
            desc: "Your total paths available.",
            icon: Route
        },
        {
            title: "Weather",
            content: `${weatherCurrent?.weatherTemp.toString()} C` ?? "Null",
            desc: "Your current weather temperature in celcius.",
            icon: Cloud
        }
    ]


    const handleLocationChange = (selectedLocation: string) => {
        switch (selectedLocation) {
            case "Dato Keramat":
                isMidnight ? setMidnightPath("/dk_midnight.csv") : setDailyPath("/dk_daily.csv");
                break;
            case "Sungai Besi":
                isMidnight ? setMidnightPath("/sb_midnight.csv") : setDailyPath("/sb_daily.csv");;
                break;
            case "Mutiara Damansara":
                isMidnight ? setMidnightPath("/md_midnight.csv") : setDailyPath("/md_daily.csv");;
                break;
            default:
                toast.error("Invalid location");
                return;
        }
    };

    const handleTimeChange = (selectedTime: string) => {
        switch (selectedTime) {
            case "Daily":
                setIsMidnight(false);
                break;
            case "Midnight":
                setIsMidnight(true);
                break;
            default:
                setIsMidnight(false);
                toast.error("Invalid location");
                return;
        }
    }

    return (
        <div className="flex flex-col px-8 py-5 gap-5 w-full">
            <div className="flex flex-row sitems-center justify-between w-full">
                <MainHeader title="Welcome Back, Hakim 👋🏻" desc="Here is your overview." />
                <section className="flex flex-row items-center gap-x-4">
                    <SelectForm name="Time of Period" listData={listTime} handleChange={handleTimeChange} />
                    <Button asChild>
                        <Link href={'/dashboard/create-drone'}>
                            Create Drone
                        </Link>
                    </Button>
                </section>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {
                    listDashData.map((eachData, index) => {
                        return (
                            <DashCard key={index} props={{
                                title: eachData.title,
                                content: eachData.content,
                                desc: eachData.desc,
                                icon: eachData.icon
                            }} />
                        )
                    })
                }
            </div>

            <div className="flex flex-col lg:flex-row items-start w-full h-full justify-center gap-4">
                <Card className="w-full lg:w-3/4 h-full shadow border">
                    <CardHeader className="flex flex-col lg:flex-row  gap-2  items-start lg:items-center justify-between">
                        <CardTitle>
                            {isMidnight ? "Data Analytics Midnight" : "Data Analytics Daily"}
                        </CardTitle>
                        <SelectForm name="Location" listData={locations} handleChange={handleLocationChange} />
                    </CardHeader>
                    <CardContent>
                        {
                            isMidnight ?
                                (
                                    <DashMidnightLineChart datamidnight={data} />
                                ) :
                                (
                                    <DashLineChart datahour={data} />
                                )
                        }
                    </CardContent>
                </Card>

                <Card className="w-full lg:w-1/3 shadow border">
                    <CardHeader className="flex flex-col lg:flex-row  gap-2  items-start lg:items-center justify-between">
                        <CardTitle>
                            {isMidnight ? "Midnight" : "Daily"}
                        </CardTitle>
                        <SelectForm name="Location" listData={locations} handleChange={handleLocationChange} />

                    </CardHeader>

                    <CardContent>
                        {
                            isMidnight ?
                                (
                                    <DashMidnightPieChart datamidnight={data} />
                                )
                                :
                                (
                                    <DashPieChart datahour={data} />
                                )
                        }

                    </CardContent>

                </Card>
            </div>

        </div>
    )
}

export function BuildHeader() {
    return (
        <div className="flex flex-row items-center justify-between rounded-md p-2 border">
            <p className="font-medium text-sm">Dashboard</p>
            <div className="flex flex-row items-center gap-x-4">
                <Button variant={"outline"}>
                    Manual Control
                </Button>
                <Button asChild>
                    <Link href={'/dashboard/create-drone'}>
                        Add Drone
                    </Link>
                </Button>
            </div>
        </div>
    )
}



