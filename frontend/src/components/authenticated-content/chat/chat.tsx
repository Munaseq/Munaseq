"use client";

import Button from "@/components/common/buttons/button";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

import { UserDataDto } from "@/dtos/user-data.dto";
import { Chat, Message } from "@/dtos/message-data.dto";
import ChatBubble from "@/components/common/chat-bubble";
import LogoLoading from "@/components/common/logo-loading";

// Using a ref to maintain socket instance between renders
// instead of a global variable for better lifecycle management

export default function ChatComponent({
    token,
    url,
    currentUser,
    reciverUser,
}: {
    token: string;
    url: string;
    currentUser: UserDataDto;
    reciverUser: UserDataDto;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const chatIdRef = useRef<string>("");
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
        const onNewChat = ({ chatId }: {chatId: string}) => {
            console.log("Chat data received:", chatId);
            chatIdRef.current = chatId;
            socket.emit("SelectChat", {
                chatId: chatId,
            });
        };

        const onChat = (data: Chat) => {
            setIsLoading(false);
            setMessages(data.Messages.reverse());
        }

        const onMessage = (data: any) => {
            if (data.chatId !== chatIdRef.current) return;
            setMessages(prev => [...prev, data.message]);
        };

        const onError = (data: any) => {
            console.error("Socket error:", data);
        };

        // Register event listeners
        socket.on("connect", () => {
            console.log("Socket connected");
            socket.emit("NewChat", {
                receiverId: reciverUser.id,
            });
        });

        socket.on("NewChat", onNewChat);
        socket.on("Chat", onChat);
        socket.on("Message", onMessage);
        socket.on("Error", onError);

        // Clean up function to remove event listeners
        return () => {
            socket.off("Chat", onChat);
            socket.off("NewChat", onNewChat);
            socket.off("Message", onMessage);
            socket.off("Error", onError);
        };
    }, [token, url]);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !chatIdRef.current) return;

        socketRef.current.emit("Message", {
            chatId: chatIdRef.current,
            message: messageInput,
            category: "Direct_Message_Chat",
        });

        setMessageInput("");
    };

    return (
        <div>
            {!isLoading && (
                <>
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
                                    isMember={true}
                                    isEventCreator={false}
                                    isPresenter={false}
                                    isModerator={false}
                                />
                            ))
                        )}
                    </div>

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
