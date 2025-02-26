/*
* A component that contains a next page component and previous page component and display what the current page number is
*/
import { Filters } from "types/filters"
import { PageNavigationButton } from "./page-navigation-button"
import { PaginationData } from "types/pagination-data"

export const PageSelection = ({
    filters,
    pageData,
    setFilters,
    applyFilters,
}: {
    filters: Filters;
    pageData: PaginationData;
    setFilters: (filters: Filters) => void;
    applyFilters: (filters: Filters) => void;
}) => {
    const shouldHide = pageData.totalPages == 0 ? "hidden" : undefined;
    return (
        <div className={`flex place-content-between ${shouldHide}`}>
            <div className="space-x-1">
                <PageNavigationButton type={"first"} filters={filters} pageData={pageData} setFilters={setFilters} applyFilters={applyFilters}/>
                <PageNavigationButton type={"prev"} filters={filters} pageData={pageData} setFilters={setFilters} applyFilters={applyFilters}/>   
            </div>
            <div className="content-center tracking-tighter">
                <span className="opacity-60">Page {pageData.currentPage} / {pageData.totalPages}</span>
            </div>
            <div className="space-x-1">
                <PageNavigationButton type={"next"} filters={filters} pageData={pageData} setFilters={setFilters} applyFilters={applyFilters}/>
                <PageNavigationButton type={"last"} filters={filters} pageData={pageData} setFilters={setFilters} applyFilters={applyFilters}/> 
            </div>
        </div>
        
    )
}
