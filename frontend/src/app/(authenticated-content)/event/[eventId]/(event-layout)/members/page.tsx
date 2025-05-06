import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Subtitle from "@/components/common/text/subtitle";
import getAllUsers from "@/proxy/user/get-all-user-event-action";
import { UserDataDto } from "@/dtos/user-data.dto";
import { UsersRoundIcon } from "lucide-react";
import MemberCard from "@/components/authenticated-content/event/event-layout/member-card";
import getProfileAction from "@/proxy/user/get-profile-action";

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

    const currentUser = await getProfileAction();

    return (
        <div className="mb-10">
            <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
                <UsersRoundIcon
                    className="text-custom-light-purple"
                    size={32}
                />
                أعضاء الفعالية
            </h1>
            <Subtitle>المنسق</Subtitle>
            <div className="flex flex-wrap gap-1 mt-10">
                <MemberCard
                    firstName={Users.eventCreator.firstName}
                    lastName={Users.eventCreator.lastName}
                    username={Users.eventCreator.username}
                    showContact={
                        currentUser.username !== Users.eventCreator.username
                    }
                />
            </div>
            {Users.moderators.length !== 0 && (
                <>
                    <Subtitle>المنظمين</Subtitle>
                    <div className="flex flex-wrap gap-1 mt-10">
                        {Users.moderators.map(moderator => (
                            <MemberCard
                                key={moderator.id}
                                firstName={moderator.firstName}
                                lastName={moderator.lastName}
                                username={moderator.username}
                                showContact={
                                    currentUser.username !== moderator.username
                                }
                            />
                        ))}
                    </div>{" "}
                </>
            )}

            {Users.presenters.length !== 0 && (
                <>
                    <Subtitle>المقدمين</Subtitle>
                    <div className="flex flex-wrap gap-1 mt-10">
                        {Users.presenters.map(presenter => (
                            <MemberCard
                                key={presenter.id}
                                firstName={presenter.firstName}
                                lastName={presenter.lastName}
                                username={presenter.username}
                                showContact={
                                    currentUser.username !== presenter.username
                                }
                            />
                        ))}
                    </div>
                </>
            )}

            <Subtitle>المشاركين</Subtitle>
            <div className="flex flex-wrap gap-1 mt-10">
                {Users.joinedUsers.map(user => (
                    <MemberCard
                        key={user.id}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        username={user.username}
                        showContact={currentUser.username !== user.username}
                    />
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
