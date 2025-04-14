'use client';

import getEventsAction from '@/proxy/event/get-events-action';
import { useSearchParams } from 'next/navigation';
import { useState, useRef, useCallback } from 'react';
import SmallCard from '@/components/common/cards/small-card';
import { EventDataDto } from '@/dtos/event-data.dto';
import getDate from '@/util/get-date';
import LogoLoading from '@/components/common/logo-loading';

export default function SearchObserver({itemsPerPage, firstPageResults}: {itemsPerPage: number, firstPageResults: EventDataDto[]}) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('searchTerm') || '';
  const [results, setResults] = useState<EventDataDto[]>(firstPageResults);
  const pageNumber = useRef(1)
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchResults = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    console.log('Fetching page ' + pageNumber.current);
    try {
      const response = await getEventsAction({
        pageNumber: pageNumber.current,
        pageSize: itemsPerPage,
        title: searchTerm,
      });
      console.log(response)

      setResults((prevResults) => [...prevResults, ...response]);
      setHasMore(response.length === itemsPerPage); // Check if there are more results based on the response length
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

//   console.log("pageNumber", pageNumber);
  const bottomElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
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
      </div>

      {/* Observer target element below the list */}
      <div ref={bottomElementRef} className="h-10"></div>

      {loading && (
        <div className="grid place-items-center mt-4">
          <LogoLoading className="w-20 aspect-square" />
        </div>
      )}

      {!hasMore && results.length > 0 && (
        <div className="text-center mt-4 text-gray-500">
          لا توجد المزيد من النتائج
        </div>
      )}
    </>
  );
}