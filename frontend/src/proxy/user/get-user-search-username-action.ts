'use server'

export default async function getUserSearchAction(username?: string) {
    try {
      const url = new URL(`${process.env.BACKEND_URL}/user`);
      const params = new URLSearchParams();
  
      if (username) {
        params.append("username", username);
      }
  
      url.search = params.toString();
  
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("User not found");
      }
      const responseJson = await response.json();

      return responseJson;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }