"use server"

import { DRONEURL } from "@/lib/secret"
import { revalidatePath } from "next/cache";

export const getDrones = async () => {

    const response = await fetch(DRONEURL, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        cache: "no-cache"
    });

    const jsonData = await response.json();

    if (!response.ok) {
        return {
            value: null,
            status: jsonData.status
        }
    }

    return {
        value: jsonData,
        status: 200
    }

}

export const getSingleDrone = async (droneID: string) => {

    const response = await fetch(`${DRONEURL}/${droneID}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        cache: "no-cache"
    });

    const jsonData = await response.json();

    if (!response.ok) {

        return {
            value: jsonData.mesage,
            status: response.status
        }
    }

    return {
        value: jsonData,
        status: response.status
    }
}

export const postDrone = async (formData: FormData) => {
    try {

        const droneName = formData.get("droneName") as string;
        const droneTag = formData.get("droneTag") as string;
        const droneBrand = formData.get("droneBrand") as string;
        const droneModel = formData.get("droneModel") as string;
        const avatarURL = formData.get("avatarURL") as string;
        const avatarURLName = formData.get("avatarURLName") as string;

        const locationName = formData.get("locationName") as string;
        const locationLat = Number.parseFloat(formData.get("locationLat") as string);
        const locationLng = Number.parseFloat(formData.get("locationLng") as string);


        const response = await fetch(DRONEURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                droneName,
                droneTag,
                droneBrand,
                droneModel,
                avatarURL,
                avatarURLName,
                droneLocation: {
                    locationName,
                    locationLat,
                    locationLng
                }
            })
        });
        const jsonData = await response.json();

        if (!response.ok) {
            return {
                value: jsonData.message || 'An error occurred',
                status: response.status
            }
        }

        revalidatePath('/dashboard/drones');


        console.log(jsonData);

        return {
            value: jsonData.message,
            status: response.status
        }

    } catch (e) {
        return {
            value: "Internal Server Error: " + e,
            status: 500
        }
    }
}


export const deleteDrone = async (droneID: string) => {

    try {
        const response = await fetch(`${DRONEURL}/${droneID}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const jsonData = await response.json();

        if (!response.ok) {
            return {
                value: jsonData.message || 'An error occurred',
                status: response.status
            }
        }

        revalidatePath('/dashboard/drones');

        return {
            value: jsonData.message,
            status: response.status
        }
    } catch (e) {
        return {
            value: "Internal Server Error: " + e,
            status: 500
        }
    }
}