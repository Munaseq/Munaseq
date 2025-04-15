'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/common/shadcn-ui/card';
import Button from '@/components/common/buttons/button';
import LogoLoading from '../common/logo-loading';
import getEventsAction from '@/proxy/event/get-events-action';
import { EventDataDto } from '@/dtos/event-data.dto';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([] as EventDataDto[]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
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

    if (searchTerm === '') {
      setDebouncedSearchTerm(searchTerm);
      return;
    }
    
    timerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearSearchTimer();
  }, [searchTerm, clearSearchTimer]);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    clearSearchTimer(); // Explicitly clear the timer
    router.push(`/search?searchTerm=${searchTerm}`);
    setSearchTerm('');
    setResults([]);
    setIsLoading(false);
    setIsFocused(false);
  }, [searchTerm, router, clearSearchTimer]);

  // Perform search when debounced term changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm) {
        setResults([]);
        return;
      }

      setIsLoading(true);

      const eventList: EventDataDto[] = await getEventsAction({
        pageSize: 3,
        title: debouncedSearchTerm,
      });

      setResults(eventList);
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
          <input
            onFocus={(e) => {
              if (innerWidth < 1024) {
                setIsFocused(true);
                e.target.blur();
              }
            }}
            placeholder="ابحث عن فعالية"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-full flex-1 px-2"
          />
          <Button gradient className="px-5 h-8">
            بحث
          </Button>
        </form>
        <div className="absolute grid place-items-center w-full bg-white z-30 shadow-md  rounded-2xl overflow-hidden ">
          {isLoading && (
            <div className="grid place-items-center p-5">
              <LogoLoading className={'w-14 aspect-square'} />
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <Card className="divide-y w-full ">
              {results.map((result, index) => (
                <Link
                  href={`/event/${result.id}`}
                  className="p-3 cursor-pointer hover:bg-[hsl(0,0,90)] flex gap-2"
                  key={index}
                  onClick={() => setSearchTerm('')}
                >
                  <div className="w-48 py-10 relative">
                    <Image
                      src={result.imageUrl}
                      alt={result.title}
                      fill
                      sizes='100%'
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-md font-bold">{result.title}</p>
                    <p className="text-custom-gray">
                      {result.eventCreator.firstName +
                        ' ' +
                        result.eventCreator.lastName}
                    </p>
                  </div>
                </Link>
              ))}
            </Card>
          )}

          {!isLoading && debouncedSearchTerm && results.length === 0 && (
            <p className="text-center text-gray-500 p-5">لا توجد نتائج للبحث</p>
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
                  setSearchTerm('');
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
                placeholder="ابحث عن فعالية"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none w-full flex-1 px-2"
              />
              <Button gradient className="px-5 h-8">
                بحث
              </Button>
            </form>
          </div>
          <div className="grid place-items-center  z-30 shadow-md mt-2 rounded-2xl overflow-hidden ">
            {isLoading && (
              <div className="grid place-items-center">
                <LogoLoading className={'w-14 aspect-square'} />
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <Card className="divide-y w-full ">
                {results.map((result, index) => (
                  <Link
                    href={`/event/${result.id}`}
                    className="p-3 cursor-pointer hover:bg-[hsl(0,0,90)] flex gap-2"
                    key={index}
                    onClick={() => {
                      setSearchTerm('');
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
                      <p className="text-md font-bold">{result.title}</p>
                      <p className="text-custom-gray">
                        {result.eventCreator.firstName +
                          ' ' +
                          result.eventCreator.lastName}
                      </p>
                    </div>
                  </Link>
                ))}
              </Card>
            )}

            {!isLoading && debouncedSearchTerm && results.length === 0 && (
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
