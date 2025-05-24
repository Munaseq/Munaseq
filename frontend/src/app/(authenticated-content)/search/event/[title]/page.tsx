import { SearchIcon } from 'lucide-react';
import Title from '@/components/common/text/title';
import SearchFetcher from '@/components/authenticated-content/search/search-fetcher';
import { Suspense } from 'react';
import LogoLoading from '@/components/common/logo-loading';
import { SearchType } from '@/util/search-type';

export default async function SearchEventPage({
  params,
}: {
  params: { title: string };
}){
  
  const itemsPerPage = 9;
  const decodedTitle = decodeURIComponent(params.title);

  if (!params.title) {
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
      <div className="grid items-center grid-cols-[min-content_1fr] mt-10 gap-4 w-full">
                <SearchIcon size={32} color="var(--custom-light-purple)" />
                <h1 className="font-bold sm:text-4xl text-2xl relative overflow-hidden py-2 w-full text-ellipsis">
                    نتائج البحث عن "{decodedTitle}"
                </h1>
            </div>
      <Suspense
        fallback={
          <div className="grid place-items-center mt-4">
            <LogoLoading className="w-20 aspect-square" />
          </div>
        }
      >
        <SearchFetcher searchType={SearchType.TITLE}  searchTerm={decodedTitle} itemsPerPage={itemsPerPage} />
      </Suspense>
    </div>
  );
}
