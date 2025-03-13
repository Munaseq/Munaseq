"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function editProfileAction(
    formData: FormData,
    deleteProfilePicture: boolean,
    deleteCV: boolean
) {
    const cookiesList = cookies();
    const token = cookiesList.get("token")?.value;
    if (!token) {
        redirect("signin");
    }

    const categories = formData.getAll("categories");
    formData.delete("categories");

    if (categories.length > 0) {
        // Ensure categories is always an array, even for a single selection
        (Array.isArray(categories) ? categories : [categories]).forEach(
            category => formData.append("categories", category as string)
        );
    }

    if ((formData.get("profilePicture") as File).size === 0) {
        formData.delete("profilePicture");
    }

    if ((formData.get("cv") as File).size === 0) {
        formData.delete("cv");
    }

    const url = new URL(`${process.env.BACKEND_URL}/user/`);
    const params = new URLSearchParams();

    params.append("removeImage", `${deleteProfilePicture}`);
    params.append("removeCV", `${deleteCV}`);
    url.search = params.toString();
    console.log(url.toString());
    try {
        const editResponse = await fetch(url.toString(), {
            method: "PATCH",
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!editResponse.ok) {
            const errorResponse = await editResponse.text(); // Capture the error message
            console.error("Error response:", errorResponse);
            throw Error(errorResponse);
        }

        revalidateTag("user");
        // create cookie and redirect to discover page
    } catch (error: any) {
        console.log(error.message);
        return {
            message: "ERROR",
        };
    }
    redirect("/account");
}
