"use client";

import { PlusIcon, UserRoundPlusIcon, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from "@/components/common/shadcn-ui/dialog";
import { useState } from "react";
import { Button } from "@/components/common/shadcn-ui/button";
import ButtonCustom from "@/components/common/buttons/button";
import { UserDataDto } from "@/dtos/user-data.dto";
import SearchUserComponent from "./search-user-to-invite";
import SendEventInviteAction from "@/proxy/event/send-event-invite-action";
import LogoLoading from "@/components/common/logo-loading";

export default function LinkUserModal({
    eventId,
    memberList,
}: {
    memberList: {
        eventCreator: UserDataDto;
        joinedUsers: UserDataDto[];
        presenters: UserDataDto[];
        moderators: UserDataDto[];
    };
    eventId: string;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<UserDataDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const resetModal = () => {
        setIsLoading(false);
        setSelectedUsers([]);
        setError(null);
        setIsModalOpen(false);
    };

    const handleAddUsers = async (users: UserDataDto[]) => {
        if (users.length === 0) {
            setError("يجب عليك اختيار مستخدم واحد على الأقل");
            return true;
        }

        users.forEach(async user => {
            const error = await SendEventInviteAction({
                eventId: eventId,
                userId: user.id,
            });
            if (error) {
                setError("حدث خطأ أثناء إرسال الدعوة");
                return true;
            }
        });

        setError(null);
        return false;
    };

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={() => {
                setSelectedUsers([]);
                setError(null);
                setIsModalOpen(prev => !prev);
            }}
        >
            <DialogTrigger>
                <UserRoundPlusIcon
                    size={32}
                    className="text-white hover:scale-105 transition-transform"
                />
            </DialogTrigger>
            <DialogContent dir="rtl" className="bg-white">
                <DialogHeader className=" !text-right  ps-4">
                    <DialogTitle>اختر المستخدم الذي تريد دعوته</DialogTitle>
                    <DialogDescription>
                        اختر المستخدم الذي تريد دعوته للفعالية
                    </DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div className="grid place-items-center p-5">
                        <LogoLoading className={"w-14 aspect-square"} />
                    </div>
                ) : (
                    <>
                        {selectedUsers.length > 0 && (
                            <div className="flex flex-col gap-2 mb-4">
                                {selectedUsers.map((user, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                                    >
                                        <span>{user.username}</span>
                                        <Button
                                            variant={"outline"}
                                            className="group h-auto p-2 aspect-square border-custom-gray hover:border-custom-light-gray rounded-full"
                                            onClick={() => {
                                                setSelectedUsers(prev =>
                                                    prev.filter(
                                                        (_, i) => i !== index
                                                    )
                                                );
                                            }}
                                        >
                                            <XIcon
                                                size={20}
                                                className="text-custom-gray group-hover:text-custom-light-gray transition-colors"
                                            />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <SearchUserComponent
                            excludeUsers={[
                                memberList.eventCreator,
                                ...memberList.joinedUsers,
                                ...memberList.moderators,
                                ...memberList.presenters,
                            ]}
                            selectedUsers={selectedUsers}
                            addUser={(user: UserDataDto) =>
                                setSelectedUsers(prevState => [
                                    ...prevState,
                                    user,
                                ])
                            }
                        />

                        {error && (
                            <p className="text-red-500 text-center my-2">
                                {error}
                            </p>
                        )}
                    </>
                )}

                <DialogFooter className="flex !justify-between sm:gap-0 gap-2">
                    <ButtonCustom
                        onClick={e => {
                            e.preventDefault();
                            resetModal();
                        }}
                    >
                        الغاء
                    </ButtonCustom>
                    <ButtonCustom
                        className="!px-10"
                        onClick={async e => {
                            e.preventDefault();
                            setIsLoading(true);
                            const error = await handleAddUsers(selectedUsers);
                            if (error) {
                                setIsLoading(false);
                                return;
                            }
                            resetModal();
                        }}
                        gradient
                    >
                        تأكيد
                    </ButtonCustom>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
