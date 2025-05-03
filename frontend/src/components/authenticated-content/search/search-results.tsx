"use client";

import getEventsAction from "@/proxy/event/get-events-action";
import { useState, useRef, useCallback, useEffect } from "react";
import SmallCard from "@/components/common/cards/small-card";
import { EventDataDto } from "@/dtos/event-data.dto";
import getDate from "@/util/get-date";
import LogoLoading from "@/components/common/logo-loading";
import { UserDataDto } from "@/dtos/user-data.dto";
import getUserSearchAction from "@/proxy/user/get-user-search-username-action";
import Link from "next/link";
import { CircleUserRoundIcon } from "lucide-react";
import Image from "next/image";
import { SearchType } from "@/util/search-type";

export default function SearchObserver({
    itemsPerPage,
    firstPageResults,
    searchType,
    searchTerm
}: {
    itemsPerPage: number;
    firstPageResults: EventDataDto[] | UserDataDto[];
    searchType: SearchType;
    searchTerm: string;
}) {
    const [results, setResults] = useState<any[]>(firstPageResults);
    const pageNumber = useRef(1);
    const [loading, setLoading] = useState(false);
    const hasMore = useRef(itemsPerPage === firstPageResults.length);
    const observer = useRef<IntersectionObserver | null>(null);



    const fetchResults = async () => {
        if (loading || !hasMore.current) return;

        setLoading(true);

        try {
            let response: any[] = [];

            // Fetch
            if (searchType === SearchType.USER) {
                response = await getUserSearchAction({
                    pageNumber: pageNumber.current,
                    pageSize: itemsPerPage,
                    username: searchTerm,
                });
            }
            if (searchType === SearchType.TITLE) {
                response = await getEventsAction({
                    pageNumber: pageNumber.current,
                    pageSize: itemsPerPage,
                    title: searchTerm,
                });
            }
            if (searchType === SearchType.CATEGORY) {
                response = await getEventsAction({
                    pageNumber: pageNumber.current,
                    pageSize: itemsPerPage,
                    category: searchTerm,
                });
            }

            setResults(prevResults => [...prevResults, ...response]);

            // Check if there are more results based on the response length
            hasMore.current = itemsPerPage === response.length;
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    };

    const bottomElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore.current) {
                    pageNumber.current += 1; // Increment page number
                    fetchResults();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <>
            <div className="grid place-items-center">
                {searchType !== SearchType.USER && (
                    <div className="flex flex-wrap mt-4 gap-8 justify-center w-full max-w-[1200px]">
                        {results.map((result: EventDataDto, index) => (
                            <div key={index} className="max-w-[340px] w-full">
                                <SmallCard
                                    key={index}
                                    image={result.imageUrl}
                                    title={result.title}
                                    date={getDate(result.startDateTime)}
                                    eventCreator={result.eventCreator}
                                    eventId={result.id}
                                    badges={result.categories}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {searchType === SearchType.USER && (
                    <div className="w-full divide-y">
                        {results.map((profileData: UserDataDto, index) => (
                            <Link
                                href={`/user/${profileData.username}`}
                                className="cursor-pointer hover:bg-[hsl(0,0,90)] flex gap-2 w-full p-3"
                                key={index}
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
                        ))}
                    </div>
                )}
            </div>

            {/* Observer target element below the list */}
            {}
            <div ref={bottomElementRef} className="h-10"></div>

            {loading && (
                <div className="grid place-items-center mt-4">
                    <LogoLoading className="w-20 aspect-square" />
                </div>
            )}

            {!hasMore.current && results.length > 0 && (
                <div className="text-center mt-4 text-gray-500">
                    لا توجد المزيد من النتائج
                </div>
            )}
        </>
    );
}
