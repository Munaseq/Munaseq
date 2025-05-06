"use client";

import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { UserDataDto } from "@/dtos/user-data.dto";
import { Chat } from "@/dtos/message-data.dto";
import LogoLoading from "@/components/common/logo-loading";
import Image from "next/image";
import Link from "next/link";
import Subtitle from "@/components/common/text/subtitle";
// Using a ref to maintain socket instance between renders
// instead of a global variable for better lifecycle management

export default function ChatMenu({
    token,
    url,
    currentUser,
}: {
    token: string;
    url: string;
    currentUser: UserDataDto;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [Chats, setChats] = useState<{
        directChats: Chat[];
        eventChats: Chat[];
    }>({
        directChats: [],
        eventChats: [],
    });
    const socketRef = useRef<any>(null);

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

        // Register event listeners
        socket.on("connect", () => {
            console.log("Socket connected");
        });

        const onChats = (data: { directChats: Chat[]; eventChats: Chat[] }) => {
            console.log("Chats data received:", data);
            setChats(data);
            setIsLoading(false);
        };

        // Clean up function to remove event listeners
        socket.on("Chats", onChats);
        return () => {
            socket.off("Chats", onChats);
        };
    }, [token, url]);

    return (
        <div className="max-w-[1050px] w-full shadow-lg rounded-2xl p-4 ">
            {isLoading ? (
                <div className="grid place-items-center w-full">
                    <LogoLoading className="w-20 aspect-square" />
                </div>
            ) : (
                <>
                        <Subtitle>
                            المحادثات المباشرة
                        </Subtitle>
                    <div className="flex flex-col pt-4">
                        {Chats.directChats.map((chat, index) => (
                            <Link
                                href={`/chat/${
                                    chat.Users.find(
                                        user => user.id !== currentUser.id
                                    )?.username
                                }`}
                                key={index}
                                className="flex justify-between flex-row-reverse gap-2 hover:bg-gray-100 p-2 rounded-lg"
                            >
                                <div className="flex gap-5">
                                    <h1 className="text-lg font-bold max-w-56 max-h-32 overflow-ellipsis overflow-hidden">
                                        {
                                            chat.Users.find(
                                                user =>
                                                    user.id !== currentUser.id
                                            )?.firstName
                                        }{" "}
                                        {
                                            chat.Users.find(
                                                user =>
                                                    user.id !== currentUser.id
                                            )?.lastName
                                        }
                                    </h1>
                                    <div className="w-20 h-20 aspect-square relative rounded-full overflow-hidden">
                                        <Image
                                            src={
                                                chat.Users[0].profilePictureUrl
                                            }
                                            fill
                                            sizes="100%"
                                            className="object-cover"
                                            alt="User profile picture"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end">
                                    <p className="text-md text-gray-500 overflow-ellipsis overflow-hidden max-h-32 max-w-56">
                                        {chat.Messages[0]?.Sender.username ===
                                            currentUser.username && (
                                            <span className="text-custom-light-purple font-bold">
                                                انت:{" "}
                                            </span>
                                        )}
                                        {chat.Messages[0]?.content}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(
                                            chat.Messages[0]?.createdAt
                                        ).toLocaleDateString("ar-EG", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}{" "}
                                        {new Date(
                                            chat.Messages[0]?.createdAt
                                        ).toLocaleTimeString("ar-EG", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                        <Subtitle >محادثات الفعاليات</Subtitle>
                    <div className="flex flex-col pt-4">
                        {Chats.eventChats.map((chat: any, index) => (
                            <Link
                                href={`/event/${chat.Event.id}/chat`}
                                key={index}
                                className="flex justify-between flex-row-reverse gap-2 hover:bg-gray-100 p-2 rounded-lg"
                            >
                                <div className="flex gap-5">
                                    <h1 className="text-lg font-bold max-w-56 max-h-32 overflow-ellipsis overflow-hidden">
                                        {chat.Event.title}
                                    </h1>
                                    <div className="rounded-lg w-20 h-20 aspect-square relative overflow-hidden">
                                        <Image
                                            src={chat.Event.imageUrl}
                                            fill
                                            sizes="100%"
                                            className="object-cover"
                                            alt="User profile picture"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end">
                                    <p className="text-md text-gray-500 overflow-ellipsis overflow-hidden max-h-32 max-w-56">
                                        {chat.Messages[0]?.Sender.username ===
                                            currentUser.username && (
                                            <span className="text-custom-light-purple font-bold">
                                                انت:{" "}
                                            </span>
                                        )}
                                        {chat.Messages[0]?.content}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(
                                            chat.Messages[0]?.createdAt
                                        ).toLocaleDateString("ar-EG", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}{" "}
                                        {new Date(
                                            chat.Messages[0]?.createdAt
                                        ).toLocaleTimeString("ar-EG", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
