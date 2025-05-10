"use server";

import { cookies } from "next/headers";

export default async function getEventAnnouncementAction(eventId: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  try {
    const announcement = await fetch(
      `${process.env.BACKEND_URL}/event/announcement/${eventId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );


    const data = await announcement.json();

    return data;
  } catch (error: any) {
    return [];
  }
}
