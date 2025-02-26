import { Filters } from "types/filters";

export const SearchBarExclude = ({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) => {
  return (
    <div className="relative">
      <input
        value={filters.keywordsEx}
        onChange={(e) => {
          // Update filters with excluded keywords while preserving other filter values
          onChange({
            ...filters,
            keywordsEx: e.target.value, 
          })
        }}
        className="w-full rounded-full bg-stone-200 py-2 pl-4 pr-10 font-medium leading-none tracking-tight placeholder-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
        placeholder="Keywords to exclude"
      />
    </div>
  );
};
