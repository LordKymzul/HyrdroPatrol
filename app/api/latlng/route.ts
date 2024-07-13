import { TResponeData } from "@/app/lib/types";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const latlngs = await prisma.latLng.findMany({
            include: {
                Path: true
            }
        });
        return NextResponse.json(latlngs, { status: 200 });
    } catch (e) {
        console.log(e);
        const response: TResponeData = {
            message: "Interval Server Error: " + e,
            status: 500
        }
        return NextResponse.json(response, { status: 500 })
    }
}