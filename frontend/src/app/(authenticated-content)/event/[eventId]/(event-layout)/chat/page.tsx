import EventChat from "@/components/authenticated-content/event/event-layout/event-chat";
import { UserDataDto } from "@/dtos/user-data.dto";
import getAllUsers from "@/proxy/user/get-all-user-event-action";
import getProfileAction from "@/proxy/user/get-profile-action";
import { MessagesSquareIcon } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChatPage({
    params,
}: {
    params: { eventId: string };
}) {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) {
        redirect("/signin");
    }
    const Users: {
        eventCreator: UserDataDto;
        joinedUsers: UserDataDto[];
        presenters: UserDataDto[];
        moderators: UserDataDto[];
    } = await getAllUsers(params.eventId);

    const currentUser:UserDataDto = await getProfileAction();

    return (
        <div>
            <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
                <MessagesSquareIcon
                    className="text-custom-light-purple"
                    size={32}
                />
                دردشة الفعالية
                
            </h1>
            <EventChat
                memberList={Users}
                eventId={params.eventId}
                token={token}
                url={`${process.env.BACKEND_URL}`}
                currentUser={currentUser}
            />
        </div>
    );
}
