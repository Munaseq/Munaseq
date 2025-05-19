import getEventsAction from "@/proxy/event/get-events-action";
import SearchResults from "@/components/authenticated-content/search/search-results";
import getUserSearchAction from "@/proxy/user/get-user-search-username-action";
import { SearchType } from "@/util/search-type";
import { convertCategoryEngToAr } from "@/util/convert-category";

export default async function SearchFetcher({
    searchTerm,
    itemsPerPage,
    searchType,
}: {
    searchTerm: string;
    itemsPerPage: number;
    searchType: SearchType;
}) {
    let results: any[] = [];
    if (searchType === SearchType.USER) {
        results = await getUserSearchAction({
            pageNumber: 1,
            pageSize: itemsPerPage,
            username: searchTerm,
        });
    }
    if (searchType === SearchType.TITLE) {
        results = await getEventsAction({
            pageNumber: 1,
            pageSize: itemsPerPage,
            title: searchTerm,
        });
    }
    if (searchType === SearchType.CATEGORY) {
        results = await getEventsAction({
            pageNumber: 1,
            pageSize: itemsPerPage,
            category: convertCategoryEngToAr(searchTerm),
        });
    }

    return (
        <>
            {results.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">لم يتم العثور على نتائج</p>
                </div>
            )}

            {results.length > 0 && (
                <SearchResults
                    searchTerm={searchTerm}
                    searchType={searchType}
                    firstPageResults={results}
                    itemsPerPage={itemsPerPage}
                />
            )}
        </>
    );
}
