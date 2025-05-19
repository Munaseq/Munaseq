"use server";

import { EventDataDto } from "@/dtos/event-data.dto";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function editEventAction(
  formData: FormData
  ,eventId: string
) {
  // get token from cookie
  const cookiesList = cookies();
  const token = cookiesList.get("token");
  if (!token?.value) {
    redirect("signin");
  }


  try {
    const editResponse = await fetch(`${process.env.BACKEND_URL}/event/${eventId}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    if (!editResponse.ok) {
        const eventData = await editResponse.json();
        throw Error(eventData.error as string);
      }

    revalidateTag("event");

   
  } catch (error: any) {
    return {
      message: error.message,
    };
  }
}
