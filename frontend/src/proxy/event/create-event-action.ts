"use server";

import { EventDataDto } from "@/dtos/event-data.dto";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function createEventAction(
  formData: FormData,
  formDataRole: FormData
) {
  // get token from cookie
  const cookiesList = cookies();
  const token = cookiesList.get("token");
  if (!token?.value) {
    redirect("signin");
  }
  let eventData: any;
  

  try {
    const createRes = await fetch(`${process.env.BACKEND_URL}/event`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    });

    eventData = await createRes.json();
    

    if (!createRes.ok) {
      throw Error(eventData.error as string);
    }

    revalidateTag("event");

    // FETCH HERE
    const rolesValue = formDataRole.getAll("roles"); // This will be FormDataEntryValue (string | File)


      try {
   
  
    
        // Iterate through roles and make API calls
        for (const role of rolesValue) {``
          
          const parsedRole = JSON.parse(role as string); 
       
          try {
            const response = await fetch(
              `${process.env.BACKEND_URL}/event/invitation/${eventData.id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token?.value}`,
                },
                body: JSON.stringify({
                  "invitationType": 'ROLE_INVITATION',
                  "receiverId": parsedRole.assignedUserId,
                  "roleType": parsedRole.role === "moderators" ? "MODERATOR" : "PRESENTER",
                }),
              }
            );

            if (!response.ok) {
              const error = await response.json();
              console.error(`Failed to assign role: ${error.message}`);
            } 
          } catch (fetchError) {
            console.error("Error during API call:", fetchError);
          }
        }
      } catch (parseError) {
        console.error("Failed to parse rolesValue:", parseError);
      }
   
      

    // const ratingRes = await fetch(
    //   `${process.env.BACKEND_URL}/event/assignRole/${eventData.id}`,
    //   {
    //     method: "POST",
    //     body:{

    //     }
    //   }
    // );
  } catch (error: any) {

    return {
      message: error.message,
    };
  }
  redirect("/event/" + eventData.id + "/about");
}
