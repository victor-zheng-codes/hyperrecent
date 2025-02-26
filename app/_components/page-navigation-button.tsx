import next from "next";
import { Filters } from "types/filters";
import { PaginationData } from "types/pagination-data";

export const PageNavigationButton = ({
    type,
    filters,
    pageData,
    setFilters,
    applyFilters,
}: {
    type: string;
    filters: Filters;
    pageData: PaginationData;
    setFilters: (filters: Filters) => void;
    applyFilters: (filters: Filters) => void;
}) => {
    let text;
    let shouldHide;
    switch (type) {
        case "first":
            text = `\u00AB`;
            shouldHide = pageData.currentPage == 1 ? "hidden" : undefined;
            break;
        case "prev":
            text = `\u2039`
            shouldHide = pageData.currentPage == 1 ? "hidden" : undefined;
            break;
        case "next":
            text = `\u203A`;
            shouldHide = pageData.currentPage == pageData.totalPages ? "hidden" : undefined;
            break;
        case "last":
            text = `\u00BB`
            shouldHide = pageData.currentPage == pageData.totalPages ? "hidden" : undefined;
            break;
    }
    
    return (
        <button 
          className={`w-10 h-10 rounded-full bg-stone-200 hover:bg-black transition colors hover:text-white ${shouldHide}`} 
          onClick={() => {
            let nextPage = filters.page;
            switch (type) {
                case "first":
                    nextPage = 1;
                    break;
                case "prev":
                    nextPage--;
                    break;
                case "next":
                    nextPage++;
                    break;
                case "last":
                    nextPage = pageData.totalPages;
                    break;
            }

            setFilters({
                ...filters,
                page: nextPage,
            })
            applyFilters({
                ...filters,
                page: nextPage,
            })
          }}
        >
            {text}
        </button>
    )
}