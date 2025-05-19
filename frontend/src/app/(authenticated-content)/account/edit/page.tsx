import { Metadata } from "next";
import Title from "@/components/common/text/title";
import getProfileAction from "@/proxy/user/get-profile-action";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { UserDataDto } from "@/dtos/user-data.dto";
import Link from "next/link";
import EditForm from "@/components/authenticated-content/account/edit-form";
import { PencilIcon, XCircleIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "تعديل معلومات الحساب",
};

export default async function Account() {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token");
  let data: UserDataDto;
  if (token) {
    data = await getProfileAction();

    return (
      <section className="relative pb-10">

        <Title>
          <PencilIcon className="text-custom-light-purple" size={32} />
          <span>تعديل معلومات الحساب</span>
          <Link className="absolute left-0" href={"/account"}>
            <XCircleIcon size={32}/>
          </Link>
          
        </Title>

        <EditForm userData={data} />
      </section>
    );
  }
  redirect("/signin");
}
