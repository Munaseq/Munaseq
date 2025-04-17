"use client";

import { PlusIcon, XIcon } from "lucide-react";
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
import SearchUser from "../search-user";
import { UserDataDto } from "@/dtos/user-data.dto";
import { useRolesContext } from "@/store/rolesContext";
import { Role, RoleDataDto } from "@/dtos/roles-data.dto";

export default function LinkUserModal({
    descriptionText,
    role,
}: {
    descriptionText: string;
    role: Role;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<UserDataDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { setRoles } = useRolesContext();

    const resetModal = () => {
        setSelectedUsers([]);
        setError(null);
        setIsModalOpen(false);
    };

    const handleAddUsers = async (users: UserDataDto[], role: Role) => {
        const newRoles: RoleDataDto[] = users.map(user => {
            return {
                user: user,
                role: role,
            };
        });

        setRoles(prevState => [...prevState, ...newRoles]);
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
                <motion.div
                    layout
                    className="grid place-items-center w-12 h-12 rounded-full border border-dashed border-gray-400 cursor-pointer"
                >
                    <PlusIcon />
                </motion.div>
            </DialogTrigger>
            <DialogContent dir="rtl" className="bg-white">
                <DialogHeader className=" !text-right  ps-4">
                    <DialogTitle>اختر المستخدم الذي تريد اضافته</DialogTitle>
                    <DialogDescription>{descriptionText}</DialogDescription>
                </DialogHeader>
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
                                            prev.filter((_, i) => i !== index)
                                        );
                                    }}
                                >
                                    <XIcon size={20} className="text-custom-gray group-hover:text-custom-light-gray transition-colors" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                <SearchUser
                roleSearched={role}
                onError={setError}
                selectedUsers={selectedUsers}
                    addUser={(user: UserDataDto) =>
                        setSelectedUsers(prevState => [...prevState, user])
                    }
                />

                {error && (
                    <p className="text-red-500 text-center my-2">
                        {error}
                    </p>
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
                        onClick={e => {
                            e.preventDefault();
                            handleAddUsers(selectedUsers, role);
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
