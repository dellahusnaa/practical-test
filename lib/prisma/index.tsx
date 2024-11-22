import { PrismaClient } from '@prisma/client'

// Fungsi untuk membuat instance PrismaClient
const prismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// Menggunakan globalThis untuk menyimpan instance PrismaClient secara global
const globalForPrisma = globalThis as unknown as { 
    prisma: PrismaClientSingleton | undefined
}

// Jika instance PrismaClient sudah ada di global, gunakan itu; jika tidak, buat yang baru
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

// Jika environment bukan production, simpan instance PrismaClient ke global
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma