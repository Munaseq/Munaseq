"use server";
import { cookies } from "next/headers";

export default async function getCertificateAction(eventId: string) {
    const cookiesList = cookies();
    const token = cookiesList.get("token");

    if (!token?.value) {
        throw new Error("Unauthorized: User is not signed in.");
    }

    try {
        const eventsRes = await fetch(
            `${process.env.BACKEND_URL}/event/certificate/${eventId}`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            }
        );

        if (!eventsRes.ok) {
            throw new Error("Failed to fetch event");
        }

        const data = await eventsRes.json();
        console.log("Certificate data:", data); // Log the certificate data

        return data;
    } catch (error: any) {
        return null;
    }
}
