import ChatComponent from "@/components/authenticated-content/chat/chat";
import EventChat from "@/components/authenticated-content/event/event-layout/event-chat";
import { UserDataDto } from "@/dtos/user-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";
import getUserAction from "@/proxy/user/get-user-using-username-action";
import { MessageCircleIcon } from "lucide-react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function ChatPage({
    params,
}: {
    params: { username: string };
}) {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) {
        redirect("/signin");
    }

    const currentUser:UserDataDto = await getProfileAction();
    const reciverUser:UserDataDto = await getUserAction(params.username);

    if (!reciverUser) {
        notFound();
    }

    if (reciverUser.id === currentUser.id) {
        redirect("/user/" + currentUser.username);
    }

    return (
        <div>
            <h1 className="font-bold flex items-center text-3xl gap-2 mt-4">
                <MessageCircleIcon
                    className="text-custom-light-purple"
                    size={32}
                />
                دردشة مع {reciverUser?.firstName} {reciverUser?.lastName}
                
            </h1>
            <ChatComponent
                
                token={token}
                url={`${process.env.BACKEND_URL}`}
                currentUser={currentUser}
                reciverUser={reciverUser}
            />
        </div>
    );
}
