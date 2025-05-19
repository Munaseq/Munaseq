"use server";
import { cookies } from "next/headers";

export default async function getFollowersUsersAction() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/followers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch followers users");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching followers users:", error);
    return null;
  }
}
