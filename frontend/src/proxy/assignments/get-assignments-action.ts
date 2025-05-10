import { cookies } from "next/headers";

export default async function getAssignmentAction(eventID: string) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  try {
    const assignments = await fetch(
      `${process.env.BACKEND_URL}/event/assignments/${eventID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    const data = await assignments.json();

    return data.assignments;
  } catch (error: any) {
    return [];
  }
}
