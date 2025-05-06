"use client";

import Button from "@/components/common/buttons/button";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import { UserDataDto } from "@/dtos/user-data.dto";
import { Chat, Message } from "@/dtos/message-data.dto";
import ChatBubble from "@/components/common/chat-bubble";
import LogoLoading from "@/components/common/logo-loading";
import changeChatState from "@/proxy/change-chat-state";

// Using a ref to maintain socket instance between renders
// instead of a global variable for better lifecycle management

export default function EventChat({
    memberList,
    eventId,
    token,
    url,
    currentUser,
}: {
    memberList: {
        eventCreator: UserDataDto;
        joinedUsers: UserDataDto[];
        presenters: UserDataDto[];
        moderators: UserDataDto[];
    };
    eventId: string;
    token: string;
    url: string;
    currentUser: UserDataDto;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOpenForParticipants, setIsOpenForParticipants] =
        useState<boolean>(false);
    const eventChatIdRef = useRef<string>("");
    const socketRef = useRef<any>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Function to scroll to the bottom of the messages container
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Initialize socket connection or reuse existing
        if (!socketRef.current) {
            socketRef.current = io(`${url}`, {
                extraHeaders: {
                    authorization: `Bearer ${token}`,
                },
            });
        }

        // Using local reference for better readability
        const socket = socketRef.current;

        // Set up event listeners
        const onChat = (data: Chat) => {
            console.log("Chat data received:", data);
            if (data.id !== eventChatIdRef.current) return;
            setIsLoading(false);
            setIsOpenForParticipants(data.isAttendeesAllowed);
            setMessages(data.Messages.reverse());
        };

        const onChats = (data: any) => {
            const eventChats = data.eventChats || [];
            let found = false;

            for (const eventChat of eventChats) {
                if (eventChat.Event.id === eventId) {
                    eventChatIdRef.current = eventChat.id;
                    found = true;
                    break;
                }
            }

            if (found && eventChatIdRef.current) {
                // Request chat data to load message history
                socket.emit("SelectChat", {
                    chatId: eventChatIdRef.current,
                });
            }
        };

        const onMessage = (data: any) => {
            if (data.chatId !== eventChatIdRef.current) return;
            setMessages(prev => [...prev, data.message]);
        };

        const onError = (data: any) => {
            console.error("Socket error:", data);
        };

        // Register event listeners
        socket.on("connect", () => {
            console.log("Socket connected");

            // Request available chats to find our event chat
            socket.emit("GetChats");
        });

        socket.on("Chat", onChat);
        socket.on("Chats", onChats);
        socket.on("Message", onMessage);
        socket.on("Error", onError);

        // Clean up function to remove event listeners
        return () => {
            socket.off("Chat", onChat);
            socket.off("Chats", onChats);
            socket.off("Message", onMessage);
            socket.off("Error", onError);
        };
    }, [eventId, token, url]);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !eventChatIdRef.current) return;

        socketRef.current.emit("Message", {
            chatId: eventChatIdRef.current,
            message: messageInput,
            category: "Group_Message_Chat",
        });

        setMessageInput("");
    };

    
    return (
        <div>
            {!isLoading && (
                <>
                    {memberList.eventCreator.id === currentUser.id && (
                        <Button
                            onClick={async () => {
                                setIsLoading(true);
                                const error = await changeChatState(
                                    eventId,
                                    !isOpenForParticipants
                                );
                                if (error) {
                                    console.error("Error:", error.message);
                                    setIsLoading(false);
                                    return;
                                }
                                setIsOpenForParticipants(
                                    !isOpenForParticipants
                                );
                                setIsLoading(false);
                            }}
                            className="my-2"
                        >
                            {!isOpenForParticipants
                                ? "فتح الدردشة"
                                : "غلق الدردشة"}
                        </Button>
                    )}
                    <div
                        ref={messagesContainerRef}
                        className="h-[550px] overflow-y-auto flex flex-col gap-4 mt-4 p-2"
                    >
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                لا توجد رسائل بعد
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <ChatBubble
                                    key={index}
                                    message={message}
                                    isSender={
                                        message.Sender.id === currentUser.id
                                    }
                                    isEventCreator={
                                        memberList.eventCreator.id ===
                                        message.Sender.id
                                    }
                                    isPresenter={memberList.presenters.some(
                                        presenter =>
                                            presenter.id === message.Sender.id
                                    )}
                                    isModerator={memberList.moderators.some(
                                        moderator =>
                                            moderator.id === message.Sender.id
                                    )}
                                    isMember={memberList.joinedUsers.some(
                                        user => user.id === message.Sender.id
                                    )}
                                />
                            ))
                        )}
                    </div>
                    {(isOpenForParticipants ||
                        !memberList.joinedUsers.some(
                            joinedUser => joinedUser.id === currentUser.id
                        )) && (
                        <form
                            className="flex gap-2 items-center mt-4"
                            onSubmit={e => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                        >
                            <input
                                placeholder="اكتب رسالتك ..."
                                className="flex-1 p-2 px-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-custom-light-purple focus:border-transparent transition-all shadow-sm"
                                value={messageInput}
                                onChange={e => setMessageInput(e.target.value)}
                            />
                            <Button gradient>إرسال</Button>
                        </form>
                    )}
                </>
            )}
            {isLoading && (
                <div className="grid place-items-center w-full">
                    <LogoLoading className="w-20 aspect-square" />
                </div>
            )}
        </div>
    );
}
