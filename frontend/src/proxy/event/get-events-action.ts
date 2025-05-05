"use server";

export default async function getEventsAction({
  pageNumber,
  pageSize,
  title,
  category,
  highestRated,
}: {
  pageNumber?: number;
  pageSize?: number;
  title?: string;
  category?: string;
  highestRated?: boolean;
} = {}) {
  try {
  
    const url = new URL(`${process.env.BACKEND_URL}/event`);
    const params = new URLSearchParams();

    if (pageNumber !== undefined) {
      params.append("pageNumber", pageNumber.toString());
    }
    if (pageSize !== undefined) {
      params.append("pageSize", pageSize.toString());
    }
    if (title !== undefined) {
      params.append("title", title);
    }
    if (category !== undefined) {
      params.append("category", category);
    }
    if (highestRated !== undefined) {
      params.append("highestRated", highestRated.toString());
    }

    url.search = params.toString();

    const eventsRes = await fetch(url.toString(), {
      next: {
        tags: ["event"],
      },
      // cache: 'no-store'
    });

    if (!eventsRes.ok) {
      throw new Error(`HTTP error! status: ${eventsRes.status}`);
    }
    //create fake delay for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const data = await eventsRes.json();
    

    return data;
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return null;
  }
}
