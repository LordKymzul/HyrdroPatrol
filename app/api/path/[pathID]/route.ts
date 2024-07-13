import { TResponeData } from "@/app/lib/types";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: {
    params: {
        pathID: string
    }
}) => {
    try {
        const findPath = await prisma.path.findUnique({
            where: {
                pathID: params.pathID
            }
        });

        if (!findPath) {
            const response: TResponeData = {
                message: "Path Not Found",
                status: 404
            }
            return NextResponse.json(response, { status: 404 })
        }

        await prisma.latLng.deleteMany({
            where: {
                pathID: params.pathID
            }
        });

        await prisma.path.delete({
            where: {
                pathID: params.pathID
            },

        });

        const response: TResponeData = {
            message: "Successfully Deleted Path",
            status: 200
        }

        return NextResponse.json(response, { status: 200 });
    } catch (e) {
        console.log(e);
        const response: TResponeData = {
            message: "Interval Server Error: " + e,
            status: 500
        }
        return NextResponse.json(response, { status: 500 });
    }
}


export const GET = async (req: NextRequest, { params }: {
    params: {
        pathID: string
    }
}) => {

    try {
        //const droneID = req.nextUrl.searchParams.get('droneID');
        const droneID = params.pathID

        const findPath = await prisma.path.findUnique({
            where: {
                droneId: droneID ?? ""
            },
            include: {
                drone: true,
                dronePathLatLng: true
            }
        });

        if (!findPath) {
            const response: TResponeData = {
                message: "Path Not Found",
                status: 404
            }
            return NextResponse.json(response, { status: 404 })
        }

        return NextResponse.json(findPath, { status: 200 });

    } catch (e) {
        const response: TResponeData = {
            message: "Interval Server Error: " + e,
            status: 500
        }
        return NextResponse.json(response, { status: 500 });
    }
}


