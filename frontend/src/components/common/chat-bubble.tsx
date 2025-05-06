import { Message } from "@/dtos/message-data.dto";
import { CircleUserRoundIcon } from "lucide-react";
import Image from "next/image";

export default function ChatBubble({
    message,
    isSender,
    isEventCreator,
    isPresenter,
    isMember,
}: {
    message: Message;
    isSender: boolean;
    isEventCreator: boolean;
    isPresenter: boolean;
    isMember: boolean;
}) {
    if (!isSender) {
        return (
            <div className="flex gap-2 items-end justify-end">
                <div className="flex flex-col gap-1 shadow-md p-2 rounded-xl rounded-bl-none border-gray-200 border">
                    <div className="flex items-center gap-2 ">
                        {!isMember ? (
                            <div className="flex items-center gap-2 ">
                                <span className="text-sm font-bold">
                                    {message.Sender.firstName}{" "}
                                    {message.Sender.lastName}
                                </span>
                                <span className="text-sm font-bold text-white bg-gradient-to-r from-custom-light-purple to-custom-dark-purple p-1 rounded-md">
                                    {isEventCreator
                                        ? "المنسق"
                                        : isPresenter
                                        ? "مقدم"
                                        : "منظم"}
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm font-bold">
                                {message.Sender.firstName}{" "}
                                {message.Sender.lastName}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">{message.content}</p>
                    <span className="text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                </div>
                <div className="w-10 h-10 aspect-square relative rounded-full overflow-hidden">
                    {
                        message.Sender.profilePictureUrl ? (<Image
                            src={message.Sender.profilePictureUrl}
                            fill
                            sizes="100%"
                            className="object-cover"
                            alt="User profile picture"
                        /> ): (
                            <CircleUserRoundIcon className="w-full h-full aspect-square"/>
                        )
                    }
                    
                </div>
            </div>
        );
    }
    return (
        <div className="flex gap-2 items-end justify-start">
            <div className="flex flex-col gap-1 shadow-md p-2 rounded-xl rounded-br-none bg-custom-gradient texst-white">
                <p className="text-sm text-white font-bold">{message.content}</p>
                <span className="text-xs text-gray-300">
                    {new Date(message.createdAt).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
}
