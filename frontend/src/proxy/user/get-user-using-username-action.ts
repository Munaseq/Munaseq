"use server";

export default async function getUserAction(username: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/user/username/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw Error("user not found");
    }
    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return undefined;
  }
}


