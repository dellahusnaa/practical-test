'use client'

import { useSession } from "next-auth/react"; // Mengimpor hook useSession dari next-auth
import { useEffect, useState } from "react"; // Mengimpor useEffect dan useState dari React

const RootLayoutComponent = () => {
    const { data: session, status } = useSession(); // Mengambil data session dan status dari useSession
    const [checkSession, changeCheckSession] = useState(false); // State untuk memeriksa session

    useEffect(() => {
        // Efek yang dijalankan ketika status session berubah
        if (checkSession) {
            window.location.reload(); // Memuat ulang halaman jika checkSession true
        }
        // Mengubah checkSession menjadi true setelah 1 detik
        setTimeout(() => changeCheckSession(true), 1000);
    }, [status]); // Dependensi: status

    return null; // Tidak ada elemen yang dirender
}

export default RootLayoutComponent;
