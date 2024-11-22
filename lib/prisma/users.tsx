import prisma from ".";

// Only for authenticating
export async function getUserByEmail(email: string) {
    try {
        const res = await prisma.user.findFirst({
            where: { email: email, }
        });
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function getUserByID(id: string) {
    try {
        const res = await prisma.user.findFirst({
            select: {
                id: true,
                name: true,
                email: true,
            },
            where: { id: id }
        });
        return { res };
    } catch (error) {
        return { error };
    }
}
