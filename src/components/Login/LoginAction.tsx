

import { signIn } from "next-auth/react";

export async function LoginAction(prevState: any, formData: FormData) {
    try {
        const status = await signIn("credentialsAuth", {
            redirect: false,
            email: formData.get("email"),
            password: formData.get("password"),
        });
        if(status?.error){
            return { message: status?.error };
        }
        return { message: "Anda berhasil login" };
    } catch (e) {
        return { messasge: "Anda gagal login" };
    }
}