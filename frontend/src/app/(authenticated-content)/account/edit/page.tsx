import { Metadata } from "next";
import Title from "@/components/common/text/title";
import penIcon from "@/assets/icons/edit-gradient.svg";
import xIcon from '@/assets/icons/x.svg'
import Image from "next/image";
import getProfileAction from "@/proxy/user/get-profile-action";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { UserDataDto } from "@/dtos/user-data.dto";
import Link from "next/link";
import EditForm from "@/components/authenticated-content/account/edit-form";

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
        {/* <Link
            href="/account"
            className="bg-black text-white p-3 rounded-full font-bold text-sm"
          >
            معلومات الحساب
          </Link> */}
        <Title>
          <Image src={penIcon} className="sm:w-14 w-10" alt="" />
          <span>تعديل معلومات الحساب</span>
          <Link className="absolute left-0" href={"/account"}>
            <Image className="left-0 w-10" src={xIcon} alt="x icon" />
          </Link>
          
        </Title>

        <EditForm userData={data} />
      </section>
    );
  }
  redirect("/signin");
}
