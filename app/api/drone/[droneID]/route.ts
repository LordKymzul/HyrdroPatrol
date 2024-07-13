import { TResponeData } from "@/app/lib/types";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ErrorCode } from "react-dropzone";

export const GET = async (req: NextRequest, { params }: {
    params: {
        droneID: string
    }
}) => {

    const findDrone = await prisma.drone.findUnique({
        where: {
            droneID: params.droneID
        },
        include: {
            droneAvatar: true,
            droneLocation: true,

        }
    })
    if (!findDrone) {
        const response: TResponeData = {
            message: "Not Found",
            status: 404
        }
        return NextResponse.json(response, { status: 404 })
    }

    return NextResponse.json(findDrone, { status: 200 });
}

export const DELETE = async (req: NextRequest, { params }: {
    params: {
        droneID: string
    }
}) => {
    try {
        const findDrone = await prisma.drone.findUnique({
            where: {
                droneID: params.droneID
            },
        });

        if (!findDrone) {
            const response: TResponeData = {
                message: "Not Found",
                status: 404
            }
            return NextResponse.json(response, { status: 404 })
        }




        await prisma.path.deleteMany({
            where: {
                droneId: params.droneID
            }
        })

        await prisma.avatar.deleteMany({
            where: {
                droneId: params.droneID
            }
        })

        await prisma.location.deleteMany({
            where: {
                droneID: params.droneID
            }
        })

        await prisma.drone.delete({
            where: {
                droneID: params.droneID
            },
        });

        const response: TResponeData = {
            message: "Successfully Deleted Drone",
            status: 200
        }

        return NextResponse.json(response, { status: 200 });
    } catch (e) {
        const response: TResponeData = {
            message: "Interval Server Error: " + e,
            status: 500
        }
        return NextResponse.json(response, { status: 500 });
    }
}