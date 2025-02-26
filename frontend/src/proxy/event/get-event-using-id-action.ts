"use server";

export default async function getEventAction(eventId: string) {
    try {
        const eventsRes = await fetch(
            `${process.env.BACKEND_URL}/event/` + eventId,
            {
                next: {
                    tags: ["event"],
                },
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
