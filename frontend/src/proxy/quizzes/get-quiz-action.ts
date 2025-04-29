import { cookies } from "next/headers";

export default async function getQuizAction(eventID: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  try {
    const quizzes = await fetch(
      `${process.env.BACKEND_URL}/event/quizzes/${eventID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    const data = await quizzes.json();
    console.log("quizzes data:", data.quizzes); // Debugging line

    return data.quizzes;
  } catch (error: any) {
    return [];
  }
}
