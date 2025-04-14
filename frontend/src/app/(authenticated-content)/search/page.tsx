"use client";

import getEventsAction from "@/proxy/event/get-events-action";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

import { Skeleton } from "@/components/common/shadcn-ui/skeleton";
import { Card } from "@/components/common/shadcn-ui/card";
import SmallCard from "@/components/common/cards/small-card";
import { EventDataDto } from "@/dtos/event-data.dto";
import getDate from "@/util/get-date";
import { SearchIcon } from "lucide-react";
import Title from "@/components/common/text/title";
import LogoLoading from "@/components/common/logo-loading";

const SearchPage = () => {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get("searchTerm") || "";
    const [results, setResults] = useState<EventDataDto[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 4;

    const observer = useRef<IntersectionObserver | null>(null);
    const lastResultElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPageNumber(prevPageNumber => prevPageNumber + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        // Reset results when search term changes
        setResults([]);
        setPageNumber(1);
        setHasMore(true);
    }, [searchTerm]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchTerm) return;

            setLoading(true);
            try {
                const response = await getEventsAction({
                    pageNumber: pageNumber,
                    pageSize: itemsPerPage,
                    title: searchTerm,
                });

                setResults(prevResults => [
                    ...prevResults,
                    ...response,
                ]); 
                setHasMore(response.length === itemsPerPage); // Check if there are more results based on the response length
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [searchTerm, pageNumber]);

    if (!searchTerm) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4">البحث</h1>
                    <p className="text-gray-500">الرجاء إدخال مصطلح للبحث</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-center">
                
            </h1>
            <Title>
                <SearchIcon size={32} color="var(--custom-light-purple)"/>
                نتائج البحث عن "{searchTerm}"
            </Title>

            {results.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500">لم يتم العثور على نتائج</p>
                </div>
            )}

            <div className="flex flex-wrap mt-4 gap-8 lg:justify-start justify-center">
                {results.map((result: EventDataDto, index) => (
                    <div
                        key={result.id}
                        ref={
                            index === results.length - 1
                                ? lastResultElementRef
                                : null
                        }
                        className="max-w-[340px] w-full"
                    >
                        <SmallCard
                            key={result.id}
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

            {loading && (
                <div className="grid place-items-center mt-10">

                    <LogoLoading className="w-20 aspect-square" />
                </div>
            )}

            {!hasMore && results.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    لا توجد المزيد من النتائج
                </div>
            )}
        </div>
    );
};

export default SearchPage;
