"use server";

export default async function isEmailUniqueAction(email: string) {
    try {
        const response = await fetch(
            `${process.env.BACKEND_URL}/user/email/${email}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            throw new Error("EMAIL_NOT_UNIQUE");
        }

        if (response.status === 400) {
            return { passed: true, error: "" };
        }

        throw new Error('ERROR')

        
    } catch (error: any) {
        return { passed: false, error: error.message };
    }
}
