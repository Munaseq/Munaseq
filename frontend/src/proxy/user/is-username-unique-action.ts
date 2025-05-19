"use server";

export default async function isUsernameUniqueAction(username: string) {
    try {
        const response = await fetch(
            `${process.env.BACKEND_URL}/user/username/${username}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            throw new Error("USERNAME_NOT_UNIQUE");
        }

        if (response.status === 400) {
            return { passed: true, error: "" };
        }

        throw new Error('ERROR')
    } catch (error: any) {
        return { passed: false, error: error.message };
    }
}
