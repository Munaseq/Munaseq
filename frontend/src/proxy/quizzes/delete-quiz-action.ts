"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function deleteQuizAction(
  quizId: string,
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
      `${process.env.BACKEND_URL}/event/quiz/${quizId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );


    if (!deleteRes.ok) {
      const errorResponse = await deleteRes.text(); // Capture the error message
      console.error("Error response:", errorResponse);
      throw Error(errorResponse);
    }
  } catch (error: any) {
    console.error("Error deleting quiz:", error);
    throw new Error(error.message || "An unexpected error occurred.");
  }
  redirect(`./activities`);
}
