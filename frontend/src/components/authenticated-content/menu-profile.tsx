
import Image from "next/image";
import Dropdown from "./dropdown-options";
import { UserDataDto } from "@/dtos/user-data.dto";
import { CircleUserRoundIcon } from "lucide-react";

export default function MenuProfile({ profileData, onLinkClick }: { profileData: UserDataDto, onLinkClick?: () => void }) {
 
    return (
      <div className="flex gap-3 p-5 items-center">
        <div className="w-20 h-20 relative rounded-full overflow-hidden">
          {profileData.profilePictureUrl ? (
            <Image
              src={profileData.profilePictureUrl}
              alt="preview"
              fill
              sizes="100%"
              priority
            />
          ) : (
            <CircleUserRoundIcon className="w-full h-full"/>
          )}
        </div>
        <div className="mt-2">
          <div className="font-bold text-lg text-nowrap overflow-ellipsis overflow-hidden w-44">
            {profileData.firstName + " " + profileData.lastName}
          </div>
          <div className="text-custom-gray text-nowrap overflow-ellipsis overflow-hidden w-44">
            {profileData.username}
          </div>
        </div>
        <Dropdown onLinkClick={onLinkClick} />
      </div>
    );
}
