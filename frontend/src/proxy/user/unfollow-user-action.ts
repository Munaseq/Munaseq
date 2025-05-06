"use server";
import { cookies } from "next/headers";

export default async function UnfollowUserAction(userId: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/user/unfollow/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to unfollow user");
    }

    const data = await response.json();
    console.log("Unfollow user response:", data); // Debugging line
    return data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return null;
  }
}
