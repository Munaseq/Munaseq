"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/common/shadcn-ui/card";
import Button from "@/components/common/buttons/button";
import LogoLoading from "../common/logo-loading";
import getEventsAction from "@/proxy/event/get-events-action";
import { EventDataDto } from "@/dtos/event-data.dto";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRightIcon,
    ChevronDownIcon,
    CircleUserRoundIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SearchType } from "@/util/search-type";
import { useSearchTypeContext } from "@/store/search-type-context";
import SearchTypeDialog from "./search-type-dialog";
import getUserSearchAction from "@/proxy/user/get-user-search-username-action";
import { UserDataDto } from "@/dtos/user-data.dto";

import { Category } from "@/util/categories";
import CategoryComponent from "../common/category";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../common/shadcn-ui/dialog";
import { motion } from "framer-motion";
import category from "../common/category";
import { convertCategoryArToEng } from "@/util/convert-category";

const SearchComponent = () => {
    const { searchType }: { searchType: SearchType } = useSearchTypeContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState(
        [] as EventDataDto[] | UserDataDto[]
    );
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const mobileSearchRef = useRef<HTMLInputElement>(null);

    // Clear timer function
    const clearSearchTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Debounce search term with ref to track timer
    useEffect(() => {
        clearSearchTimer(); // Clear any existing timer

        if (searchTerm === "") {
            setDebouncedSearchTerm(searchTerm);
            return;
        }

        timerRef.current = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => clearSearchTimer();
    }, [searchTerm, clearSearchTimer]);

    // Handle form submission
    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            clearSearchTimer(); // Explicitly clear the timer

            if (searchType === SearchType.TITLE) {
                router.push(`/search/event/${searchTerm}`);
            }
            if (searchType === SearchType.USER) {
                router.push(`/search/user/${searchTerm}`);
            }
            if (searchType === SearchType.EVENT_ID) {
                router.push(`/event/${searchTerm}`);
            }
            setSearchTerm("");
            setResults([]);
            setIsLoading(false);
            setIsFocused(false);
        },
        [searchTerm, router, clearSearchTimer]
    );

    const handleChangeType = () => {
        setSearchTerm("");
        clearSearchTimer();
        setResults([]);
        setIsLoading(false);
        setIsFocused(false);
    };

    // Perform search when debounced term changes
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedSearchTerm) {
                setResults([]);
                return;
            }

            setIsLoading(true);

            let results: EventDataDto[] | UserDataDto[] = [];
            if (SearchType.TITLE === searchType) {
                results = await getEventsAction({
                    pageSize: 3,
                    title: debouncedSearchTerm,
                });
            }
            if (SearchType.USER === searchType) {
                results = await getUserSearchAction({
                    username: debouncedSearchTerm,
                    pageSize: 3,
                });
            }

            setResults(results);
            setIsLoading(false);
        };

        performSearch();
    }, [debouncedSearchTerm]);

    return (
        <>
            <div className="mx-auto space-y-2 relative lg:w-3/4 max-w-[500px] lg:min-w-[300px] w-full">
                <form
                    onSubmit={handleSubmit}
                    className="w-full lg:mx-auto bg-white rounded-full shadow-md flex items-center p-3"
                >
                    {searchType === SearchType.CATEGORY ? (
                        <Dialog
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                        >
                            <DialogTrigger className="!w-full !flex-1">
                                <div className=" text-gray-500 text-start flex justify-between gap-5">
                                    ادخل فئة الفعالية
                                    <ChevronDownIcon />
                                </div>
                            </DialogTrigger>
                            <DialogContent dir="rtl" className="bg-white">
                                <DialogHeader className=" !text-right  ps-4">
                                    <DialogTitle>ادخل فئة الفعالية</DialogTitle>
                                    <DialogDescription>
                                        اختر الفئة التي تريد بحث فعاليات عنها
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex flex-wrap gap-2 my-4 overflow-hidden">
                                    {Object.values(Category).map(category => {
                                        return (
                                            <CategoryComponent
                                                notAnimate
                                                key={category}
                                                active
                                                onClick={() => {
                                                    setIsModalOpen(false);
                                                    router.push(
                                                        `/search/category/${convertCategoryArToEng(
                                                            category
                                                        )}`
                                                    );
                                                }}
                                            >
                                                {category}
                                            </CategoryComponent>
                                        );
                                    })}
                                </div>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <input
                            onFocus={e => {
                                if (innerWidth < 1024) {
                                    setIsFocused(true);
                                    e.target.blur();
                                }
                            }}
                            placeholder={
                                searchType === SearchType.TITLE
                                    ? "ادخل عنوان الفعالية"
                                    : searchType === SearchType.EVENT_ID
                                    ? "ادخل رقم الفعالية"
                                    : "ابحث عن مستخدم"
                            }
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="outline-none w-full flex-1 px-2"
                        />
                    )}
                    <SearchTypeDialog onChangeType={handleChangeType} />
                    <Button gradient className="px-5 h-8 hidden lg:block">
                        بحث
                    </Button>
                </form>
                <div className="absolute grid place-items-center w-full bg-white z-30 shadow-md  rounded-2xl overflow-hidden ">
                    {isLoading && (
                        <div className="grid place-items-center p-5">
                            <LogoLoading className={"w-14 aspect-square"} />
                        </div>
                    )}

                    {!isLoading &&
                        results.length > 0 &&
                        searchType === SearchType.TITLE && (
                            <Card className="divide-y w-full ">
                                {(results as EventDataDto[]).map(
                                    (result, index) => (
                                        <Link
                                            href={`/event/${result.id}`}
                                            className="p-3 cursor-pointer hover:bg-[hsl(0,0,90)] flex gap-2"
                                            key={index}
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <div className="w-48 py-10 relative">
                                                <Image
                                                    src={result.imageUrl}
                                                    alt={result.title}
                                                    fill
                                                    sizes="100%"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-md font-bold">
                                                    {result.title}
                                                </p>
                                                <p className="text-custom-gray">
                                                    {result.eventCreator
                                                        .firstName +
                                                        " " +
                                                        result.eventCreator
                                                            .lastName}
                                                </p>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </Card>
                        )}
                    {!isLoading &&
                        results.length > 0 &&
                        searchType === SearchType.USER && (
                            <Card className="divide-y w-full ">
                                {(results as UserDataDto[]).map(
                                    (profileData, index) => (
                                        <Link
                                            href={`/user/${profileData.username}`}
                                            className="cursor-pointer hover:bg-[hsl(0,0,90)] flex gap-2 w-full p-3"
                                            key={index}
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <div className="flex  gap-3 items-center">
                                                <div className="w-20 h-20 relative rounded-full overflow-hidden">
                                                    {profileData.profilePictureUrl ? (
                                                        <Image
                                                            src={
                                                                profileData.profilePictureUrl
                                                            }
                                                            alt="preview"
                                                            fill
                                                            sizes="100%"
                                                            priority
                                                        />
                                                    ) : (
                                                        <CircleUserRoundIcon className="w-full h-full" />
                                                    )}
                                                </div>
                                                <div className="mt-2">
                                                    <div className="font-bold text-lg text-nowrap overflow-ellipsis overflow-hidden w-44">
                                                        {profileData.firstName +
                                                            " " +
                                                            profileData.lastName}
                                                    </div>
                                                    <div className="text-custom-gray text-nowrap overflow-ellipsis overflow-hidden w-44">
                                                        {profileData.username}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </Card>
                        )}

                    {!isLoading &&
                        SearchType.EVENT_ID !== searchType &&
                        SearchType.CATEGORY !== searchType &&
                        debouncedSearchTerm &&
                        results.length === 0 && (
                            <p className="text-center text-gray-500 p-5">
                                لا توجد نتائج للبحث
                            </p>
                        )}
                </div>

                {/* mobile search ---------------------------------------------------- */}
            </div>
            {isFocused && innerWidth < 1024 && (
                <div className="w-screen h-screen bg-white top-0 z-30 p-4 fixed lg:hidden">
                    <div className="flex items-center gap-2">
                        <ArrowRightIcon
                            className="cursor-pointer"
                            size={32}
                            onClick={() => {
                                if (innerWidth < 1024) {
                                    clearSearchTimer();
                                    setSearchTerm("");
                                    setIsFocused(false);
                                }
                            }}
                        />
                        <form
                            onSubmit={handleSubmit}
                            className="w-full lg:mx-auto rounded-full shadow-md flex items-center p-3"
                        >
                            <input
                                autoFocus
                                ref={mobileSearchRef}
                                placeholder={
                                    searchType === SearchType.TITLE
                                        ? "ابحث عن عنوان فعالية"
                                        : searchType === SearchType.EVENT_ID
                                        ? "ادخل رقم الفعالية"
                                        : "ابحث عن مستخدم"
                                }
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="outline-none w-full flex-1 px-2"
                            />
                            <SearchTypeDialog onChangeType={handleChangeType} />
                            <Button gradient className="px-5 h-8">
                                بحث
                            </Button>
                        </form>
                    </div>
                    <div className="grid place-items-center  z-30 shadow-md mt-2 rounded-2xl overflow-hidden ">
                        {isLoading && (
                            <div className="grid place-items-center">
                                <LogoLoading className={"w-14 aspect-square"} />
                            </div>
                        )}

                        {!isLoading &&
                            results.length > 0 &&
                            searchType === SearchType.TITLE && (
                                <Card className="divide-y w-full ">
                                    {(results as EventDataDto[]).map(
                                        (result, index) => (
                                            <Link
                                                href={`/event/${result.id}`}
                                                className="p-3 cursor-pointer hover:bg-[hsl(0,0,90)] flex gap-2"
                                                key={index}
                                                onClick={() => {
                                                    setSearchTerm("");
                                                    setIsFocused(false);
                                                }}
                                            >
                                                <div className="w-20 py-10 relative">
                                                    <Image
                                                        src={result.imageUrl}
                                                        alt={result.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-md font-bold">
                                                        {result.title}
                                                    </p>
                                                    <p className="text-custom-gray">
                                                        {result.eventCreator
                                                            .firstName +
                                                            " " +
                                                            result.eventCreator
                                                                .lastName}
                                                    </p>
                                                </div>
                                            </Link>
                                        )
                                    )}
                                </Card>
                            )}
                        {!isLoading &&
                            results.length > 0 &&
                            searchType === SearchType.USER &&
                            (results as UserDataDto[]).map(
                                (profileData, index) => (
                                    <Link
                                        href={`/user/${profileData.username}`}
                                        className="cursor-pointer hover:bg-[hsl(0,0,90)] flex gap-2 w-full p-3"
                                        key={index}
                                        onClick={() => {
                                            setSearchTerm("");
                                            setIsFocused(false);
                                        }}
                                    >
                                        <div className="flex  gap-3 items-center">
                                            <div className="w-20 h-20 relative rounded-full overflow-hidden">
                                                {profileData.profilePictureUrl ? (
                                                    <Image
                                                        src={
                                                            profileData.profilePictureUrl
                                                        }
                                                        alt="preview"
                                                        fill
                                                        sizes="100%"
                                                        priority
                                                    />
                                                ) : (
                                                    <CircleUserRoundIcon className="w-full h-full" />
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <div className="font-bold text-lg text-nowrap overflow-ellipsis overflow-hidden w-44">
                                                    {profileData.firstName +
                                                        " " +
                                                        profileData.lastName}
                                                </div>
                                                <div className="text-custom-gray text-nowrap overflow-ellipsis overflow-hidden w-44">
                                                    {profileData.username}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            )}

                        {!isLoading &&
                            SearchType.EVENT_ID !== searchType &&
                            debouncedSearchTerm &&
                            results.length === 0 && (
                                <p className="text-center text-gray-500 p-5">
                                    لا توجد نتائج للبحث
                                </p>
                            )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchComponent;
