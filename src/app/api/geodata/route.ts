import { getGeoDatas } from "@/lib/prisma/geodata";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        
        // Memanggil fungsi getGeoDatas dengan parameter 'take' dan 'page'
        const { res: data, count: count, error: geodataserr } = await getGeoDatas();

        if (geodataserr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: data, count: count }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}