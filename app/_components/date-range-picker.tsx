import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Filters } from "types/filters";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  filters: Filters;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onFilter: (filters: Filters) => void;
}

// Helper function to format dates as MM-DD-YYYY
const formatDate = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

export const DateRangePicker = ({
  startDate,
  endDate,
  filters,
  onStartDateChange,
  onEndDateChange,
  onFilter,
}: DateRangePickerProps) => {
  return (
    <div className="">
      <h2 className="mb-2 text-lg font-bold tracking-tighter">
        Pick a date range
      </h2>
      <div className="space-y-2">
        <div>
          <label className="block text-sm mb-2">From:</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => {
              onStartDateChange(date);
              if (date) {
                // If only start date is selected, use today as end date
                const effectiveEndDate = endDate || new Date();
                onFilter({
                  ...filters, 
                  start: formatDate(date), 
                  end: formatDate(effectiveEndDate)
                });
              }
            }}
            selectsStart
            startDate={startDate ?? undefined}
            endDate={endDate ?? undefined}
            className="w-full border border-black/20 p-1"
            placeholderText="Select start date"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">To:</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => {
              onEndDateChange(date);
              if (date) {
                // If only end date is selected, use date from 1 year ago as start date
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                const effectiveStartDate = startDate || oneYearAgo;
                onFilter({
                  ...filters, 
                  start: formatDate(effectiveStartDate), 
                  end: formatDate(date)
                });
              }
            }}
            selectsEnd
            startDate={startDate ?? undefined}
            endDate={endDate ?? undefined}
            minDate={startDate ?? undefined}  // Prevents selecting end date before start date
            className="w-full border border-black/20 p-1"
            placeholderText="Select end date"
          />
        </div>
      </div>
    </div>
  );
};