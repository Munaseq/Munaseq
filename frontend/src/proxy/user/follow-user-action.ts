"use server";
import { cookies } from "next/headers";

export default async function followUserAction(userId: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/user/follow/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to follow/unfollow user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    return null;
  }
}
