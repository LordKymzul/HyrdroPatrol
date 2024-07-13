import { NextResponse } from "next/server";
import { dummylistDrone } from "../lib/types";

export async function GET(request: Request) {
    // ...
    return NextResponse.json({ message: dummylistDrone });
}