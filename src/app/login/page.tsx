import React from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import LoginForm from "@/components/Login/LoginForm";
import NavbarLv1 from "@/components/Navbar/NavbarLv1";

export const metadata: Metadata = {
    title: "Login | Mental Map",
};

const SignIn: React.FC = async () => {
    const data = await getServerSession();
    if (data) {
        redirect("/")
    }
    return (

        <div className="pt-0" >
            <NavbarLv1 />
            <div className="bg-m-400 w-screen h-full">
                <LoginForm />
            </div>
        </div>
    );
};

export default SignIn;