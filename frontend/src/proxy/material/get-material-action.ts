"use server";

import { cookies } from "next/headers";

export default async function getMaterialsAction(eventId: string) {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    try {
        const materials = await fetch(
            `${process.env.BACKEND_URL}/event/materials/${eventId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token?.value}`,
                },
                next: {
                    tags: ["material"],
                },
            }
        );

        if (!materials.ok) {
            throw new Error("Failed to fetch materials");
        }

        const data = await materials.json();

        return data.Materials;
    } catch (error: any) {
        return [];
    }
}
