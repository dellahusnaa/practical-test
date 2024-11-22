import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server";
import { getUserByID } from "@/lib/prisma/users";

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request });
    if (!token) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { res, error } = await getUserByID(token.sub ?? '');
    return Response.json({ data: res }, { status: 200 });
}
