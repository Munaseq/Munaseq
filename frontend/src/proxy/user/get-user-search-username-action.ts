'use server'

export default async function getUserSearchAction({
    username,
    pageNumber,
    pageSize,
  }: {username?: string, pageNumber?: number, pageSize?: number}) {
    try {
      const url = new URL(`${process.env.BACKEND_URL}/user`);
      const params = new URLSearchParams();

      if (pageNumber !== undefined) {
        params.append("pageNumber", pageNumber.toString());
      }
      if (pageSize !== undefined) {
        params.append("pageSize", pageSize.toString());
      }
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