"use server";

import { cookies } from "next/headers";

export default async function setReminderAction(
  eventId: string,
  daysOffset: number
) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/event/reminder/${eventId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
        body: JSON.stringify({ daysOffset }),
      }
    );

    console.log("Set reminder response:", response); // Debugging line

    if (!response.ok) {
      throw new Error("Failed to set reminder");
    }

    return true;
  } catch (error) {
    console.error("Error setting reminder:", error);
    return false;
  }
}
