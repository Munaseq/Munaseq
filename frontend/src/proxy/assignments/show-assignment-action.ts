"use server";

import { redirect } from "next/navigation";

import { cookies } from "next/headers";

export default async function showAssignmentAction(assignmentId: string) {
  // get token from cookie
  const cookiesList = cookies();
  const token = cookiesList.get("token");
  if (!token?.value) {
    throw new Error("Unauthorized: User is not signed in.");
  }

  try {
    const showRes = await fetch(
      `${process.env.BACKEND_URL}/event/assignment/show/${assignmentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token?.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await showRes.json();

    return data;
  } catch (error: any) {
    console.error("Error showing assignment:", error);
    throw new Error(error.message || "An unexpected error occurred.");
  }
}
