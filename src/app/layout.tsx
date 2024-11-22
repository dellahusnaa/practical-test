import "@/app/globals.css"
import "@/app/data-tables-css.css"
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import SessionProvider from '@/components/SessionProvider/SessionProvider';
import RootLayoutComponent from "@/components/RootLayout/RootLayoutComponent";
import NavbarComponent from "@/components/Navbar/NavbarComponent";

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Mendapatkan sesi server menggunakan fungsi getServerSession
    const server_session = await getServerSession();

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className={inter.className}>
                <SessionProvider session={server_session}>
                    <div className="dark:bg-boxdark-2 ">
                        <div className="flex  overfloxw-auto">
                            <RootLayoutComponent />
                            {server_session ? (
                                <>
                                    <NavbarComponent server_session={server_session}>
                                        <main id="main-component" className="flex flex-grow ">
                                            {children}
                                        </main>
                                    </NavbarComponent>
                                </>
                            ) : (
                                <div className="relative flex flex-1 flex-col  overflow-y-auto overflow-x-hidden">

                                   
                                    <main id="main-component" className="flex flex-grow ">
                                        {children}
                                    </main>
                                </div>
                            )}
                        </div>
                    </div>
                </SessionProvider>
            </body>
        </html>
    )
}
