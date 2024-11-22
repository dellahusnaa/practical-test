import prisma from ".";

export async function getGeoDatas() {
    try {
        const res = await prisma.geoData.findMany({
           
            orderBy: [
                {
                    judul: "asc",
                },
                {
                    id: "asc",
                },
            ],
        });
        const count = await prisma.geoData.count(); // Menghitung tital jumlah data
        return { res, count };
    } catch (error) {
        return { error };
    }
}



export async function addGeoData(data: { judul: string; caption: string }) {
    try {
        const res = await prisma.geoData.create({
            data,
        });
        return { res };
    } catch (error: any) {
        console.error("Prisma Error:", error);
        return { error: error.message };
    }
}




