'use client'

import Header from "@/components/Navbar/Header";
import { Session } from "next-auth";


const NavbarComponent = ({ children, server_session }: { children: React.ReactNode, server_session: Session }) => {
    
    return (
        <>
           
            <div className="relative flex flex-1 flex-col overflow-x-hidden">
                <Header
                    session={server_session}
                />
                {children}
            </div>
        </>
    )
};

export default NavbarComponent;
