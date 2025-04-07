"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import GetUserEventsAction from "../user/get-user-events-action";
import { redirect } from "next/navigation";

export default async function joinEventAction(eventId: string) {
    const cookiesList = cookies();
    const token = cookiesList.get("token");

    const listCreatedEvents = await GetUserEventsAction();
    const createdEvent = listCreatedEvents.find(
        (event: any) => event.id === eventId
    );
    if (createdEvent) {
        return {
            error: "CREATOR",
        };
    }

    try {
        const joinRes = await fetch(`${process.env.BACKEND_URL}/event/join`, {
            method: "POST",
            body: JSON.stringify({ eventId }),
            headers: {
                Authorization: `Bearer ${token?.value}`,
                "Content-Type": "application/json",
            },
        });

        const joinResJson = await joinRes.json();

        if (!joinRes.ok) {
            console.log(joinResJson);
            throw Error(joinResJson.message);
        }

        revalidateTag("joined-events");
        
    } catch (error: any) {
        const message = error.message;
        switch (message) {
            case "User gender does not match the event's accepted gender":
                return {
                    error: "GENDER",
                };
            case "User already joined this event":
                return {
                    error: "JOINED",
                };
            default:
                return {
                    error: "ERROR",
                };
        }
    }
    redirect('/discover')
}
