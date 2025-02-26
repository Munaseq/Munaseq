"use server";

export default async function getEventsAction({
  pageNumber,
  pageSize,
  title,
}: {
  pageNumber?: number;
  pageSize?: number;
  title?: string;
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

    url.search = params.toString();

    console.log(url.toString());

    const eventsRes = await fetch(url.toString(), {
      next: {
        tags: ["event"],
      },
    });

    if (!eventsRes.ok) {
      throw new Error(`HTTP error! status: ${eventsRes.status}`);
    }

    const data = await eventsRes.json();
    console.log(data);

    return data;
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return null;
  }
}
