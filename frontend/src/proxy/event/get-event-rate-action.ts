"use server";

import { cookies } from "next/headers";

export default async function getEventRateAction(eventId: string) {
    const cookiesList = cookies();
    const token = cookiesList.get("token");

    if (!token?.value) {
        throw new Error("Unauthorized: User is not signed in.");
    }
    try {
        const eventsRes = await fetch(
            `${process.env.BACKEND_URL}/event/ratings/` + eventId,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
                next: {
                    tags: ["rating"],
                }
            }
        );

        if (!eventsRes.ok) {
            throw new Error("Failed to fetch event");
        }

        const data = await eventsRes.json();

        return data;
    } catch (error: any) {
        return null;
    }
}
