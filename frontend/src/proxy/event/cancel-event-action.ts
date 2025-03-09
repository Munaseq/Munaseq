"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function cancelEventAction(eventId: string) {
    const cookiesList = cookies();
    const token = cookiesList.get("token");

    try {
        const cancelRes = await fetch(
            `${process.env.BACKEND_URL}/event/` + eventId,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token?.value}`,
                },
            }
        );

        const cancelResJson = await cancelRes.json();

        if (!cancelRes.ok) {
            console.log(cancelResJson);
            throw Error(cancelResJson.message);
        }

        revalidateTag("joined-events");
        revalidateTag("event");

    } catch (error: any) {
        const message = error.message;
        
        return { message };
    }
    redirect("/coordinated-events/active");
}
