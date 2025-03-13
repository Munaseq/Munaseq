import { Metadata } from "next";
import Title from "@/components/common/text/title";
import {CircleUserRoundIcon, FileTextIcon, PencilIcon, UserRoundIcon} from "lucide-react";
import Image from "next/image";
import Label from "@/components/common/lable";
import Subtitle from "@/components/common/text/subtitle";
import Category from "@/components/common/category";
import { cookies } from "next/headers";
import getProfileAction from "@/proxy/user/get-profile-action";
import { redirect } from "next/navigation";
import { UserDataDto } from "@/dtos/user-data.dto";
import Link from "next/link";
import TooltipWrapper from "@/components/common/tooltip";

export const metadata: Metadata = {
  title: "معلومات الحساب",
};

export default async function Account() {
  const cookiesStore = cookies();
  const token = cookiesStore.get("token");
  let data: UserDataDto;

  if (token) {
    data = await getProfileAction();
    data.socialAccounts = JSON.parse(data.socialAccounts as string);
    return (
      <section className="relative pb-10">
        <Title>
          <Link className="absolute left-0" href={"account/edit"}>
            <PencilIcon size={32}/>
          </Link>
          <UserRoundIcon size={32} className="text-custom-light-purple"/>
          <span>معلومات الحساب</span>
        </Title>
        <div className="grid grid-cols-1 gap-10">
          <div className="grid grid-cols-1 gap-10">
            <Subtitle>المعلومات الاساسية</Subtitle>

            <Label label="الاسم المستخدم">{data.username}</Label>
            <Label label="البريد الالكتروني">{data.email}</Label>
          </div>
          <div className="grid grid-cols-1 gap-10">
            <Subtitle>معلومات الملف الشخصية</Subtitle>

            <div className="flex gap-10 ">
              <Label label="الاسم الاول">{data.firstName}</Label>
              <Label label="الاسم الاخير">{data.lastName}</Label>
            </div>
            <Label label="الاسم المعروض">
              {data.visibleName !== "null" ? data.visibleName : ""}
            </Label>
            <Label label="صورة الملف الشخصي">
              {data.profilePictureUrl ? (
                <Image
                  src={data.profilePictureUrl}
                  alt="preview"
                  priority
                  width={80}
                  height={80}
                  className="rounded-full aspect-square"
                />
              ) : (
                <CircleUserRoundIcon/>
              )}
            </Label>
            <Label label="السيرة الذاتيه">
              {data.cvUrl ? (
                 <TooltipWrapper text="عرض السيرة الذاتية">
                <a href={data.cvUrl} target="_blank" rel="noopener noreferrer">
                  <FileTextIcon className='cursor-pointer'/>
                </a>
                </TooltipWrapper>
              ) : (
                ""
              )}
            </Label>

            <Label label="رابط X">{data.socialAccounts?.xLink || ""}</Label>
            <Label label="رابط LinkedIn">
              {data.socialAccounts?.linkedinLink || ""}
            </Label>
            <Label label="الوصف" className={""}>
              {data.description}
            </Label>
            <Label label="الجنس">
              {data.gender === "MALE" ? "ذكر" : "انثى"}
            </Label>
          </div>
          <div className="grid grid-cols-1 gap-10">
            <Subtitle>الاهتمامات</Subtitle>

            <div className="flex flex-wrap gap-2">
              {data.categories.map((category) => (
                <Category key={category}>{category}</Category>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  redirect("/signin");
}
