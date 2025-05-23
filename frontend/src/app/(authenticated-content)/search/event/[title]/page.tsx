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
      <h1 className="text-2xl font-bold mb-6 text-center"></h1>
      <Title>
        <SearchIcon size={32} color="var(--custom-light-purple)" />
        نتائج البحث عن "{params.title}"
      </Title>
      <Suspense
        fallback={
          <div className="grid place-items-center mt-4">
            <LogoLoading className="w-20 aspect-square" />
          </div>
        }
      >
        <SearchFetcher searchType={SearchType.TITLE}  searchTerm={params.title} itemsPerPage={itemsPerPage} />
      </Suspense>
    </div>
  );
}
