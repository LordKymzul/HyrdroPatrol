"use server"

import { PATHURL } from "@/lib/secret";
import { TLatLng } from "../lib/types";
import { json } from "stream/consumers";
import { revalidatePath } from "next/cache";



export const getPaths = async () => {

    try {
        const response = await fetch(process.env.PATHURL!, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            cache: "no-cache"
        });

        const jsonData = await response.json();

        if (!response.ok) {
            return {
                value: jsonData.message,
                status: jsonData.status
            }
        }

        return {
            value: jsonData,
            status: response.status
        }
    } catch (e) {
        return {
            value: "Internal Server Error",
            status: 500
        }
    }
}


export const getSinglePath = async (droneID: string) => {

    try {
        const response = await fetch(`${PATHURL}/${droneID}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            cache: "no-cache"
        });

        const jsonData = await response.json();

        if (!response.ok) {
            return {
                value: jsonData.message,
                status: jsonData.status
            }
        }

        return {
            value: jsonData,
            status: 200
        };

    } catch (e) {
        return {
            value: "Internal Server Error",
            status: 500
        }
    }

}

export const postPath = async (droneID: string, droneFlyAt: Date, dronePath: TLatLng[]) => {
    try {

        const response = await fetch(PATHURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                droneID,
                droneFlyAt,
                dronePath
            })
        });

        const jsonData = await response.json();

        if (!response.ok) {
            return {
                value: jsonData.message,
                status: jsonData.status
            }
        }

        return {
            value: jsonData.message,
            status: jsonData.status
        }
    } catch (e) {
        return {
            value: "Internal Server Error",
            status: 500
        }
    }
}


export const deletePath = async (pathID: string, droneID: string) => {

    try {
        const response = await fetch(`${PATHURL}/${pathID}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const jsonData = await response.json();

        if (!response.ok) {
            return {
                value: jsonData.message,
                status: jsonData.status
            }
        }

        //revalidatePath(`dashboard/drone/${droneID}`);

        return {
            value: jsonData.message,
            status: jsonData.status
        }

    } catch (e) {
        return {
            value: "Internal Server Error",
            status: 500
        }
    }
}   