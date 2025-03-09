"use client";

import { useState, useEffect } from "react";
// import { Input } from "@/components/common/shadcn-ui/input";
import { Card } from "@/components/common/shadcn-ui/card";
// import Button from "@/components/common/button";
import LogoLoading from "../common/logo-loading";
import getUserSearchAction from "@/proxy/user/get-user-search-username-action"; // New proxy function to fetch users
import { UserDataDto } from "@/dtos/user-data.dto"; // New data DTO for user
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/common/buttons/button";
import userIcon from "@/assets/icons/user-black.svg";

const SearchUserComponent = ({
    addUser,
}: Readonly<{ addUser: (user: string) => void }>) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([] as UserDataDto[]); // Change to store users
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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

            const userList: UserDataDto[] = [
                ...(await getUserSearchAction(searchTerm)),
            ];
            // Fetch users instead of events

            setResults(userList);
            setIsLoading(false);
        };

        performSearch();
    }, [debouncedSearchTerm]);

    const handleAddUser = async (username: string) => {
        addUser(username);
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
            <div className="absolute grid place-items-center w-full bg-white z-10 shadow-lg rounded-2xl ">
                {isLoading && (
                    <div className="grid place-items-center">
                        <LogoLoading className={"w-14 aspect-square"} />
                    </div>
                )}

                {/* {!isLoading && results.length > 0 && (
          <Card className="divide-y w-full flex-col">
            {results.map((result, index) => (
              <Link
                href={`/user/${result.id}`} // Assuming user profile page URL
                className="p-3 cursor-pointer hover:bg-[hsl(0,0,90)] block"
                key={index}
                onClick={() => setSearchTerm("")}
              >
                {result.username}
              </Link>
            ))}
          </Card>
        )} */}

                {!isLoading && results.length > 0 && (
                    // <div className="flex items-center justify-between mb-4">
                    //   <h5 className="text-xl font-bold leading-none text-gray-900">
                    //     نتائج البحث
                    //   </h5>
                    // </div>
                    <div className="flow-root w-full flex-col overflow-y-auto h-52">
                        <ul role="list" className="divide-y px-4">
                            {results.map((result, index) => (
                                <li className="py-3 sm:py-4" key={index}>
                                    <div className="flex items-center">
                                        <div className="shrink-0">
                                            <Image
                                                className="w-8 h-8 rounded-full"
                                                src={
                                                    result.profilePictureUrl ||
                                                    userIcon
                                                }
                                                alt="user image"
                                            />
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
                                                className="bg-custom-gradient"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    handleAddUser(
                                                        result.username
                                                    );
                                                }}
                                            >
                                                +
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
