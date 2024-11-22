import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import ind_kabkota from "./INDKabKota.json";
import post_data from "./dataPost.json";
import { Prisma, GeoData } from "@prisma/client";

// Tipe untuk input GeoData tanpa id dan geoloc_id
type GeoDataInput = Omit<GeoData, 'id' | 'geoloc_id'>

// Tipe untuk input GeoLocation tanpa id, dengan properti geodatas
// type GeoLocInput = Omit<GeoLocation, 'id'> & {
//     geodatas: {
//         create: undefined,
//     }
// }

// Fungsi untuk memproses data kabupaten/kota dari JSON
// function indjson() {
//     const { features } = ind_kabkota as any;
//     const ind = features.map((item: any) => {
//         const temp: GeoLocInput = {
//             geoId: Number(item.properties.ID_2),
//             name: item.properties.TYPE_2 + " " + item.properties.NAME_2,
//             prov: item.properties.NAME_1,
//             geojs: item,
//             geodatas: {
//                 create: undefined,
//             },
//         };
//         return temp;
//     });
//     return { ind };
// }

// Fungsi untuk memproses data layanan dari JSON
function datalayananjson() {
    const data = post_data;
    const res = data.map((item) => {
        const temp: GeoDataInput = item;
        return temp;
    });
    return { res };
}


// Fungsi utama untuk seeding data ke database
async function main() {
    // const { ind } = indjson();
    const { res } = datalayananjson();

    // Konversi data layanan ke format Prisma
    const prismageodata = res as Prisma.GeoDataCreateManyInput[];
    
    // const prismageoloc = ind as Prisma.GeoLocationCreateInput[];

    // Menghapus koleksi lama agar tidak ada data duplikat
    try {
        const dropuser = await prisma.$runCommandRaw({
            drop: "User",
        });
     
        const dropgeodata = await prisma.$runCommandRaw({
            drop: "GeoData",
        });
    } catch (error: any) {
        // console.log(error);
    }

    // Menambahkan akun admin
    const random1 = await bcrypt.genSalt(10);
    const user = await prisma.user.create({
        data: {
            email: "adminbaik@gmail.com",
            name: "admin 1",
            password: await bcrypt.hash("admin123", random1),
            salt: random1,
        },
    });
    const random2 = await bcrypt.genSalt(10);
    await prisma.user.create({
        data: {
            email: 'adminMap@email.com',
            name: 'Admin 1',
            password: await bcrypt.hash('admin123', random2),
            salt: random2
        },
    })

    // Menambahkan data GeoLocation dan GeoData
    for (let i = 0; i < prismageodata.length; i++) {
        const gjs = await prisma.geoData.create({
            data: prismageodata[i],
        });
    }

    // Membuat indeks geospasial
    // Indeks ini memungkinkan database untuk melakukan pencarian dan analisis geografis dengan cepat
    const geoidx = await prisma.$runCommandRaw({
        createIndexes: "GeoLocation",
        indexes: [
            {
                key: {
                    "geojs.geometry": "2dsphere",
                },
                name: "geospat",
            },
        ],
    });
}

// Menjalankan fungsi utama dan menangani disconnection/error
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });