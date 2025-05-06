"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function respondToEventRequestAction({
    requestId,
    decision,
}: {
    requestId: string;
    decision: boolean;
}) {
    const cookiesList = cookies();
    const token = cookiesList.get("token");
    if (!token?.value) {
        redirect("signin");
    }

    try {
        const RequestRes = await fetch(
            `${process.env.BACKEND_URL}/event/request/respond/${requestId}`,
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

        console.log("inviteRes", await RequestRes.json());

        if (!RequestRes.ok) {
            throw new Error("Failed to respond to the request");
        }

        // fake delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        revalidateTag("request");
        revalidateTag("event");
    } catch (error: any) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return error.message;
    }
}
