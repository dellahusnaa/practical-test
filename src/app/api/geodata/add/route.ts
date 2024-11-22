import { NextRequest, NextResponse } from 'next/server';
import { addGeoData } from "@/lib/prisma/geodata";

export async function POST(request: NextRequest) {
    try {
        const reqjson = await request.json(); // Mengambil data JSON dari request
        const { res, error } = await addGeoData(reqjson);

        if (error) {
            console.error("Database Error:", error);
            return NextResponse.json({ message: error }, { status: 500 });
        }

        return NextResponse.json({ data: res }, { status: 201 });
    } catch (error: any) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ message: "internal server error" }, { status: 500 });
    }
}
