import { TDrone, TResponeData } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";


export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        const drones = await prisma.drone.findMany({
            include: {
                droneAvatar: true,
                droneLocation: true,
                dronePath: true
            }
        });
        return NextResponse.json(drones, { status: 200 });
    } catch (e) {
        const response: TResponeData = {
            message: "Interval Server Error",
            status: 500
        }
        return NextResponse.json(response, { status: 500 });
    }
}


export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const { droneName, droneTag, droneBrand, droneModel, avatarURL, avatarURLName, droneLocation } = await req.json();

        const drone = await prisma.drone.create({
            data: {
                droneName,
                droneTag,
                droneBrand,
                droneModel,
                droneAvatar: {
                    create: {
                        avatarURL,
                        avatarURLName
                    }
                },
                droneLocation: {
                    create: {
                        locationName: droneLocation.locationName,
                        locationLat: droneLocation.locationLat,
                        locationLng: droneLocation.locationLng
                    }
                }
            }
        });

        if (!drone) {
            const response: TResponeData = {
                message: "Error Creating Drone",
                status: 400
            }
            return NextResponse.json(response, { status: 400 });
        }

        const response: TResponeData = {
            message: "Successfully Created Drone",
            status: 201
        }

        return NextResponse.json(response, { status: 201 });

    } catch (e) {
        const response: TResponeData = {
            message: "Interval Server Error: " + e,
            status: 500
        }
        return NextResponse.json(response, { status: 500 });
    }
}
