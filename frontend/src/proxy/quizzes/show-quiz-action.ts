"use server";

import { redirect } from "next/navigation";

import { cookies } from "next/headers";

export default async function showQuizAction(quizId: string) {
  // get token from cookie
  const cookiesList = cookies();
  const token = cookiesList.get("token");
  if (!token?.value) {
    throw new Error("Unauthorized: User is not signed in.");
  }

  try {
    const showRes = await fetch(
      `${process.env.BACKEND_URL}/event/quiz/show/${quizId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token?.value}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Show quiz response:", showRes);

    const data = await showRes.json();
    console.log("Show quiz data:", data); // Debugging line

    return data;
  } catch (error: any) {
    console.error("Error showing quiz:", error);
    throw new Error(error.message || "An unexpected error occurred.");
  }
}
