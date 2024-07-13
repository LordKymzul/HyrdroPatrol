import { TResponeData } from "@/app/lib/types";
import prisma from "@/prisma";
import { Asap } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export interface DronePathPoint {
    lat: number;
    lng: number;
}

export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        const paths = await prisma.path.findMany({
            include: {
                drone: true,
                dronePathLatLng: true
            }
        });
        return NextResponse.json(paths, { status: 200 });
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
        const { droneID, droneFlyAt, dronePath } = await req.json();

        if (!droneID || !droneFlyAt) {
            const response: TResponeData = {
                message: "Something data was missing",
                status: 400
            }
            return NextResponse.json(response, { status: 400 });
        }

        const paths: DronePathPoint[] = dronePath;

        const formattedDronePathLatLng = paths.map((waypoint) => ({
            lat: waypoint.lat,
            lng: waypoint.lng, // Assuming 'lng' exists in DronePathPoint
        }));


        const existingDrone = await prisma.drone.findUnique({
            where: { droneID: droneID },
        });


        if (!existingDrone) {
            const response: TResponeData = {
                message: "Drone Not Found",
                status: 404
            }
            return NextResponse.json(response, { status: 404 })
        }

        const existingDronePath = await prisma.path.findUnique({
            where: {
                droneId: droneID
            }
        })

        if (existingDronePath) {
            const response: TResponeData = {
                message: "Path already exist, Clear your path.",
                status: 400
            }
            return NextResponse.json(response, { status: 400 })
        }

        const createdPath = await prisma.path.create({
            data: {
                drone: {
                    connect: {
                        droneID: droneID
                    }
                },
                droneFlyAt: new Date(),
                dronePathLatLng: {
                    create: formattedDronePathLatLng
                }

            }
        });

        const response: TResponeData = {
            message: "Successfully Created Path",
            status: 201
        }

        return NextResponse.json(response, { status: 201 });

    } catch (e) {
        console.log(e);
        const response: TResponeData = {
            message: "Interval Server Error: " + e,
            status: 500
        }
        return NextResponse.json(response, { status: 500 });
    }
}

