import MenuProfile from "./menu-profile";
import Nav from "./Nav";
import Link from "next/link";
import { UserDataDto } from "@/dtos/user-data.dto";
import { PlusCircleIcon } from "lucide-react";
import CreateEventDialog from "./create-event-dialog";
import { RolesProvider } from "@/store/roles-context";

export default function Menu({
    mobile,
    onLinkClick,
    profileData,
}: {
    mobile?: boolean;
    onLinkClick?: () => void;
    profileData: UserDataDto;
}) {
    return (
        <div
            className={
                " flex flex-col flex-1 " +
                (!mobile
                    ? "max-w-[22rem] h-screen rounded-3xl fixed bg-white lg:shadow-menu"
                    : "")
            }
        >
            <MenuProfile onLinkClick={onLinkClick} profileData={profileData} />
            <div className="!overflow-y-auto lg:flex-1 flex-none h-min">
                <Nav
                    onLinkClick={onLinkClick}
                    username={profileData?.username}
                />
            </div>
            <div className=" grid place-items-center w-full py-5">
                <RolesProvider>
                    <CreateEventDialog />
                </RolesProvider>
            </div>
        </div>
    );
}
