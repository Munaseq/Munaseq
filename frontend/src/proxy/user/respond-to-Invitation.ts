"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function responndToinvitationAction({
    invitationId,
    decision,
}: {
    invitationId: string;
    decision: boolean;
}) {
    const cookiesList = cookies();
    const token = cookiesList.get("token");
    if (!token?.value) {
        redirect("signin");
    }

    try {
        const inviteRes = await fetch(
            `${process.env.BACKEND_URL}/user/invitation/${invitationId}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token?.value}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    decision: decision,
                }),
            }
        );

        console.log("inviteRes", await inviteRes.json());

        if (!inviteRes.ok) {
            throw new Error("Failed to respond to the invitation");
        }

        // fake delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        revalidateTag("invitation");
        revalidateTag("event");
    } catch (error: any) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return error.message;
    }
}
