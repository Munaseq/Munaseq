import getEventsAction from '@/proxy/event/get-events-action';
import SearchResults from '@/components/authenticated-content/search/search-results';

export default async function SearchFetcher({
    searchTerm,
    itemsPerPage
}: {
    searchTerm: string
    itemsPerPage: number
}) {


  const results = await getEventsAction({
    pageNumber: 1,
    pageSize: itemsPerPage,
    title: searchTerm,
  });

  return (
    <>
      {results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">لم يتم العثور على نتائج</p>
        </div>
      )}

      {results.length > 0 && (
        <SearchResults
          firstPageResults={results}
          itemsPerPage={itemsPerPage}
        />
      )}
    </>
  );
}
