"use client";

import { useState, useEffect } from "react";
import LogoLoading from "../common/logo-loading";
import getUserSearchAction from "@/proxy/user/get-user-search-username-action"; // New proxy function to fetch users
import { UserDataDto } from "@/dtos/user-data.dto"; // New data DTO for user
import Image from "next/image";
import Button from "@/components/common/buttons/button";
import { PlusIcon, UserRoundIcon } from "lucide-react";
import { useRolesContext } from "@/store/roles-context";
import { Role } from "@/dtos/roles-data.dto";
import getProfileAction from "@/proxy/user/get-profile-action";

const SearchUserComponent = ({
    addUser,
    selectedUsers,
    onError,
    roleSearched
}: {
    addUser: (user: UserDataDto) => void; // Function to add user
    selectedUsers: UserDataDto[]; // Array of selected users
    onError: (message: string) => void; // Function to handle error
    roleSearched: Role
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([] as UserDataDto[]); // Change to store users
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const {roles} = useRolesContext();

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Perform search when debounced term changes
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedSearchTerm) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            const currentUser: UserDataDto = await getProfileAction(); // Fetch current user
            const userList: UserDataDto[] = [
                ...(await getUserSearchAction(searchTerm)),
            ];
            // filter users that are already selected and that are in roles
            const filteredUsers = userList.filter(user => {
                return !selectedUsers.some(selectedUser => selectedUser.id === user.id) &&
                    !roles.some(role => role.user.id === user.id) &&
                    user.id !== currentUser.id; // Exclude current user
            });

            setResults(filteredUsers); // Set results to filtered users
            setIsLoading(false);
        };

        performSearch();
    }, [debouncedSearchTerm]);

    const handleAddUser = (user: UserDataDto) => {
        const numOfSelectedUsers = selectedUsers.length + roles.reduce((acc, role) => {
            if (role.role === roleSearched) {
                return acc + 1;
            }
            return acc;
        }, 0);

        if (numOfSelectedUsers >= 3) {

            onError('لا يمكنك اختيار أكثر من 3 أشخاص');
            return;
        }
        setResults([]); // Clear results after adding user
        setSearchTerm(""); // Clear search term after adding user
        setDebouncedSearchTerm(""); // Clear debounced search term after adding user
        addUser(user);
    };

    return (
        <div className="mx-auto space-y-2 relative w-full">
            
            <div className="w-full lg:mx-auto bg-gray-50 rounded-2xl shadow-md flex items-center p-3 ">
                <input
                    placeholder="أدخل اسم المستخدم"
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="outline-none w-full flex-1 px-2 bg-gray-50"
                />
            </div>
            <div className="grid place-items-center w-full bg-white z-10 shadow-lg rounded-2xl ">
                {isLoading && (
                    <div className="grid place-items-center p-5">
                        <LogoLoading className={"w-14 aspect-square"} />
                    </div>
                )}

                {!isLoading && results.length > 0 && (
                    <div className="flow-root w-full flex-col overflow-y-auto max-h-48">
                        <ul role="list" className="divide-y px-4">
                            {results.map((result, index) => (
                                <li className="py-3 sm:py-4" key={index}>
                                    <div className="flex items-center">
                                        <div className="relative shrink-0 w-10 h-10 ">
                                            {result.profilePictureUrl ? (
                                                <Image
                                                    className="rounded-full"
                                                    src={
                                                        result.profilePictureUrl
                                                    }
                                                    fill
                                                    alt="user image"
                                                />
                                            ) : (
                                                <UserRoundIcon className="w-full h-full" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {`${result.firstName} ${result.lastName}`}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {result.username}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900">
                                            <Button
                                                className="bg-custom-gradient !p-2 aspect-square !h-auto"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    handleAddUser(
                                                        result
                                                    );
                                                }}
                                            >
                                                <PlusIcon size={20} />
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            
                        </ul>
                    </div>
                )}

                {!isLoading && debouncedSearchTerm && results.length === 0 && (
                    <p className="text-center text-gray-500 p-5">
                        لا توجد نتائج للبحث
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchUserComponent;
