import { MessagesSquareIcon } from "lucide-react";
import Title from "@/components/common/text/title";
import { UserDataDto } from "@/dtos/user-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import ChatMenu from "../../../components/authenticated-content/chat/chat-menu";

export default async function ChatPage() {
    const cookiesStore = cookies();
    const token = cookiesStore.get("token")?.value;
    if (!token) {
        redirect("/signin");
    }

    const currentUser: UserDataDto = await getProfileAction();

    return (
        <div>
            <Title>
                <MessagesSquareIcon
                    className="text-custom-light-purple"
                    size={32}
                />
                المحادثات
            </Title>
            <div className="grid place-items-center w-full mt-8">
                <ChatMenu
                    token={token}
                    url={`${process.env.BACKEND_URL}`}
                    currentUser={currentUser}
                />
            </div>
        </div>
    );
}
