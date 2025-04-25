"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {


  const mappedFormData = new FormData();

  // Mapping frontend fields to backend fields
  mappedFormData.append("username", formData.get("username") as string);
  mappedFormData.append("email", formData.get("email") as string);
  mappedFormData.append("firstName", formData.get("firstName") as string);
  mappedFormData.append("lastName", formData.get("lastName") as string);
  mappedFormData.append("password", formData.get("password") as string);
  mappedFormData.append("visibleName", formData.get("displayName") as string);
  mappedFormData.append("profilePicture", formData.get("profileImage") as File);
  mappedFormData.append("gender", formData.get("gender") as string);

  //if only one tag is selected it will treat it as a single value. Thus, an error will occur
  const categories = formData.getAll("categories");
  if (categories.length > 0) {
    // Ensure categories is always an array, even for a single selection
    (Array.isArray(categories) ? categories : [categories]).forEach((category) =>
      mappedFormData.append("categories", category as string)
    );
  }


  try {
    const createResponse = await fetch(`${process.env.BACKEND_URL}/auth/signUp`, {
      method: "POST",
      body: mappedFormData,
    });

    if (!createResponse.ok) {
      const errorResponse = await createResponse.text(); // Capture the error message
      console.error("Error response:", errorResponse);
    }

    const createResponseData = await createResponse.json();
    const token = createResponseData.access_token;

 

    const cookieStore = cookies();
    cookieStore.set("token", token, { maxAge: 259200, path: "/" });

    // create cookie and redirect to discover page
  } catch (error: any) {
    return {
      message: "حدث خطأ اثناء التسجيل الرجاء المحاولة مره اخرى في وقت لاحق",
    };
  }

  redirect("/discover");
}
