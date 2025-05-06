'use server'

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SendEventInviteAction({eventId, userId}: {
    eventId: string;
    userId: string;
}) {
    const cookiesList = cookies();
    const token = cookiesList.get("token");
    if (!token?.value) {
        redirect("signin");
    }
    try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/event/invitation/${eventId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token?.value}`,
            },
            body: JSON.stringify({
              "invitationType": 'EVENT_INVITATION',
              "receiverId": userId,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to assign role: ${error.message}`);
        } 
        revalidateTag("invitation");

      } catch (fetchError) {
        console.error("Error during API call:", fetchError);
        return "Failed to send invitation";
      }
}