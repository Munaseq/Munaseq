"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function getRecommendedEvents() {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token");
    if (!token) {
        redirect("/signin");
    }



    try {
        const eventsRes = await fetch(
            `${process.env.BACKEND_URL}/event/recommended`,
            {
                next: {
                    tags: ["event"],
                },
                headers: {
                    Authorization: `Bearer ${token?.value}`,
                }
            }
        );
        const data = await eventsRes.json();
        console.log(data);

        if (!eventsRes.ok) {
            throw new Error("Failed to fetch event");
        }


        return data;
    } catch (error: any) {
        return null;
    }
}
