import LoginForm from '@/components/Login/LoginForm';
import { Metadata } from "next";
import MainComponent from "@/components/Dashboard/MainComponent";
import { getServerSession } from "next-auth/next"

export const metadata: Metadata = {
    title: "Bencana Live",
};

export default async function Home() {
    const session = await getServerSession();
    return (
        <>
            {session ? (
                <MainComponent />
            ) : (
                <LoginForm />
            )}
        </>
    )
}
