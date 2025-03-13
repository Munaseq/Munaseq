import MenuProfile from "./menu-profile";
import Nav from "./Nav";
import Link from "next/link";
import { UserDataDto } from "@/dtos/user-data.dto";
import { PlusCircleIcon } from "lucide-react";

export default function Menu({
    mobile,
    onLinkClick,
    profileData
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
                <MenuProfile
                    onLinkClick={onLinkClick}
                    profileData={profileData}
                />
                <div className="!overflow-y-auto flex-1 h-min">
                    <Nav
                        onLinkClick={onLinkClick}
                        username={profileData?.username}
                    />
                </div>
                <div className=" grid place-items-center w-full p-10">
                    <Link
                        onClick={onLinkClick}
                        href="/create-event"
                        className="bg-custom-gradient  px-6 py-4 text-white  text-xl flex justify-center items-center gap-3 bg-[length:120%] hover:bg-right transition-all rounded-full font-semibold text-nowrap "
                    >
                        نسق فعاليتك{" "}
                        <PlusCircleIcon/>
                    </Link>
                </div>
            </div>
        );
    }

   
