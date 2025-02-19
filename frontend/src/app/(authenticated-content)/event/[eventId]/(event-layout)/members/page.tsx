import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import userIcon from "@/assets/icons/user-gradiant.svg";
import Subtitle from "@/components/common/text/subtitle";
import getAllUsers from "@/proxy/user/get-all-user-event-action";
import { UserDataDto } from "@/dtos/user-data.dto";

type Material = {
    materialId: string;
    materialUrl: string;
    createdAt: string;
};

export default async function MembersPage({
    params,
}: {
    params: { eventId: string };
}) {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token");
    if (!token) {
        redirect("/signin");
    }
    const Users: {
        eventCreator: UserDataDto;
        joinedUsers: UserDataDto[];
        presenters: UserDataDto[];
        moderators: UserDataDto[];
    } = await getAllUsers(params.eventId);

    return (
        <div className="mb-10">
            <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
                <Image
                    className="sm:w-12 w-10"
                    src={userIcon}
                    alt="material icon"
                />
                أعضاء الفعالية
            </h1>
            <Subtitle>المنسق</Subtitle>
            <div className="flex flex-wrap gap-1 mt-10">
                <div>
                    {Users.eventCreator.firstName +
                        " " +
                        Users.eventCreator.lastName}
                </div>
            </div>
            <Subtitle>المنظمين</Subtitle>
            <div className="flex flex-wrap gap-1 mt-10">
                {Users.moderators.map(moderator => (
                    <div key={moderator.id}>
                        {moderator.firstName + " " + moderator.lastName}
                    </div>
                ))}
                {Users.moderators.length === 0 && (
                    <p className="p-2 text-custom-gray">
                        لا يوجد المنظمين في الفعالية
                    </p>
                )}
            </div>
            <Subtitle>المقدمين</Subtitle>
            <div className="flex flex-wrap gap-1 mt-10">
            {Users.presenters.map(presenter => (
                    <div key={presenter.id}>
                        {presenter.firstName + " " + presenter.lastName}
                    </div>
                ))}
                {Users.presenters.length === 0 && (
                    <p className="p-2 text-custom-gray">
                        لا يوجد المقدمين في الفعالية
                    </p>
                )}
            </div>
            <Subtitle>المشاركين</Subtitle>
            <div className="flex flex-wrap gap-1 mt-10">
            {Users.joinedUsers.map(user => (
                    <div key={user.id}>
                        {user.firstName + " " + user.lastName}
                    </div>
                ))}
                {Users.joinedUsers.length === 0 && (
                    <p className="p-2 text-custom-gray">
                        لا يوجد مشاركين في الفعالية
                    </p>
                )}
            </div>
        </div>
    );
}
