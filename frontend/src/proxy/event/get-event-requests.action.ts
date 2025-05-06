'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function getEventRequestsAction(eventId: string) {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) {
        return redirect("/signin");
    }

    try {
        const eventsRes = await fetch(
            `${process.env.BACKEND_URL}/event/requests/` + eventId,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    
                },
                next: {
                    tags: ["request"],
                },
            }
        );

        console.log("eventsRes", await eventsRes.json());

        if (eventsRes.status === 404) {
            return [];
        }

        if (!eventsRes.ok) {
            throw new Error("Failed to fetch event requests");
        }

        const data = await eventsRes.json();

        return data;
    } catch (error: any) {

        return null;
    }
}