import getEventsAction from '@/proxy/event/get-events-action';
import SmallCard from '@/components/common/cards/small-card';
import { EventDataDto } from '@/dtos/event-data.dto';
import getDate from '@/util/get-date';
import { SearchIcon } from 'lucide-react';
import Title from '@/components/common/text/title';
import SearchObserver from '@/components/authenticated-content/search/search-observer';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { searchTerm: string };
}) {
  const searchTerm = searchParams.searchTerm;
  const itemsPerPage = 1;

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

  const results = await getEventsAction({
    pageNumber: 1,
    pageSize: itemsPerPage,
    title: searchTerm,
  });

  console.log('results', results.length === itemsPerPage);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center"></h1>
      <Title>
        <SearchIcon size={32} color="var(--custom-light-purple)" />
        نتائج البحث عن "{searchTerm}"
      </Title>

      {results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">لم يتم العثور على نتائج</p>
        </div>
      )}

     
        <SearchObserver firstPageResults={results} itemsPerPage={itemsPerPage} />
      
    </div>
  );
}
