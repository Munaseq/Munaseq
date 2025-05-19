"use server";

import { cookies } from "next/headers";

export default async function sendAnnouncementAction(text: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  try {
    const announcement = await fetch(
      `${process.env.BACKEND_URL}/user/followers/announcement`,
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
