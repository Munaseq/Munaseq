"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function submitQuizAction(
  quizId: string,
  eventId: string,
  answersToSubmit: any
) {
  // get token from cookie
  const cookiesList = cookies();
  const token = cookiesList.get("token");
  if (!token?.value) {
    throw new Error("Unauthorized: User is not signed in.");
  }

  try {
    const submitRes = await fetch(
      `${process.env.BACKEND_URL}/event/quiz/submit/${quizId}`,
      {
        method: "POST",
        body: JSON.stringify(answersToSubmit),
        headers: {
          Authorization: `Bearer ${token?.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!submitRes.ok) {
      const errorResponse = await submitRes.text(); // Capture the error message
      console.error("Error response:", errorResponse);
      throw Error(errorResponse);
    }
  } catch (error: any) {
    console.error("Error submitting quiz:", error);
    throw new Error(error.message || "An unexpected error occurred.");
  }
  redirect(`/event/${eventId}/activities`);
}
