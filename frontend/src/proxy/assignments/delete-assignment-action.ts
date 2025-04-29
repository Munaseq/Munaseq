"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function deleteAssignmentAction(
  assignmentId: string,
  eventId: string
) {
  // get token from cookie
  const cookiesList = cookies();
  const token = cookiesList.get("token");
  if (!token?.value) {
    throw new Error("Unauthorized: User is not signed in.");
  }

  try {
    const deleteRes = await fetch(
      `${process.env.BACKEND_URL}/event/assignment/${assignmentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );
    console.log("Delete assignment response:", deleteRes);

    if (!deleteRes.ok) {
      const errorResponse = await deleteRes.text(); // Capture the error message
      console.error("Error response:", errorResponse);
      throw Error(errorResponse);
    }
  } catch (error: any) {
    console.error("Error deleting assignment:", error);
    throw new Error(error.message || "An unexpected error occurred.");
  }
  redirect(`./activities`);
}
