import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/lib/prisma/users";
import bcrypt from "bcrypt"; // untuk memverifikasi password yang telah di-hash
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest } from "next/server";

async function auth(req: NextRequest, res: any) {
    const providers = [
        CredentialsProvider({
            id: "credentialsAuth",            
            name: 'Credentials',         
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log("testAuthorize")
                try {
                    // Ambil email dan password dari credentials yang dikirim oleh user
                    const { password, email } = credentials as Record<"email" | "password", string>;
                    // cek keberadaan user berdasarkan email
                    const { res, error } = await getUserByEmail(email);
                    if (error) {
                        throw new Error("Request cannot be processed");
                    }
                    if (!res) {
                        throw new Error("Email atau password yang Anda masukkan salah!");
                    }
                    // Cek kecocokan password menggunakan bcrypt
                    const checkPassword = await bcrypt.compare(password, res.password);
                    if (!checkPassword || res.email !== email) {
                        throw new Error("Email atau kata sandi tidak cocok. Silakan coba lagi.");
                    }
                    return res;
                } catch (error: any) {
                    throw new Error(error.message);
                }
                return null;
            }
        }),
    ];
    return await NextAuth(req, res, {
        adapter: PrismaAdapter(prisma), // Menggunakan Prisma Adapter untuk NextAuth
        providers: providers, // Daftar provider otentikasi
        session: {
            strategy: "jwt", // Menggunakan strategi session JSON Web Token
            maxAge: 60 * 30, // Batas waktu sesi dalam detik (30 menit)
        },
        pages: {
            signIn: '/login', // Halaman untuk sign-in
            error: '/login', // Halaman error, kode error disertakan dalam query string sebagai ?error=
            verifyRequest: '/auth/verify-request', // Halaman untuk verifikasi permintaan (digunakan untuk cek pesan email)
        }
    });
}

export { auth as GET, auth as POST }
