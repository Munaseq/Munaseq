"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function createAssignmentAction(
  eventId: string,
  assignmentData: any
) {
  // get token from cookie
  const cookiesList = cookies();
  const token = cookiesList.get("token");
  if (!token?.value) {
    throw new Error("Unauthorized: User is not signed in.");
  }

  try {
    const createRes = await fetch(
      `${process.env.BACKEND_URL}/event/assignment/${eventId}`,
      {
        method: "POST",
        body: JSON.stringify(assignmentData),
        headers: {
          Authorization: `Bearer ${token?.value}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!createRes.ok) {
      const errorResponse = await createRes.text(); // Capture the error message
      console.error("Error response:", errorResponse);
      throw Error(errorResponse);
    }
  } catch (error: any) {
    console.error("Error creating assignment:", error);
    throw new Error(error.message || "An unexpected error occurred.");
  }
  redirect(`./`);
}
