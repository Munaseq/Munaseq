"use server";

import { cookies } from "next/headers";

export default async function getFollowingUsersAction() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/following`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch following users");
    }

    const data = await response.json();
    console.log("Following users data:", data?.followingUsers); // Debugging line
    return data?.followingUsers;
  } catch (error) {
    console.error("Error fetching following users:", error);
    return null;
  }
}
