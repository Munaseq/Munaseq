"use server";

import { cookies } from "next/headers";

export default async function sendEventAnnouncementAction(
  eventId: string,
  text: string
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  try {
    const announcement = await fetch(
      `${process.env.BACKEND_URL}/event/announcement/${eventId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    const data = await announcement.json();

    return data;
  } catch (error: any) {
    return [];
  }
}
