"use server";
import { redirect, useParams } from "next/navigation";
import { cookies } from "next/headers";

export default async function updateQuizAction(
  quizId: string,
  eventId: string,
  quizData: any
) {
  // get token from cookie
  const cookiesList = cookies();
  const token = cookiesList.get("token");
  if (!token?.value) {
    throw new Error("Unauthorized: User is not signed in.");
  }

  try {
    const updateRes = await fetch(
      `${process.env.BACKEND_URL}/event/quiz/${quizId}`,
      {
        method: "PATCH",
        body: JSON.stringify(quizData),
        headers: {
          Authorization: `Bearer ${token?.value}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!updateRes.ok) {
      const errorResponse = await updateRes.text(); // Capture the error message
      console.error("Error response:", errorResponse);
      throw Error(errorResponse);
    }
  } catch (error: any) {
    console.error("Error updating quiz:", error);
    throw new Error(error.message || "An unexpected error occurred.");
  }
  redirect(`/event/${eventId}/activities`);
}
