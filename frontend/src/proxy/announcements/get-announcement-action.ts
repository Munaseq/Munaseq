"use server";

import { cookies } from "next/headers";

export default async function getAnnouncementAction() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  try {
    const announcement = await fetch(
      `${process.env.BACKEND_URL}/user/followingUsers/announcement`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    const data = await announcement.json();
    console.log("Announcement data:", data); // Debugging line

    return data;
  } catch (error: any) {
    return [];
  }
}
