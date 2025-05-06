"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function getInvitesAction() {
    const cookiesList = cookies();
    const token = cookiesList.get("token");
    if (!token?.value) {
        redirect("signin");
    }

    try {
        const inviteRes = await fetch(
            `${process.env.BACKEND_URL}/user/invitation`,
            {
                next: {
                    tags: ["invitation"],
                },
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token?.value}`,
                },
            }
        );

        if (!inviteRes.ok) {
            throw new Error("Failed to fetch user events");
        }

        return await inviteRes.json();
    } catch (error: any) {
        return null;
    }
}
