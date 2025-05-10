"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { EventStatus } from "./events-overview";

interface EventsFiltersProps {
  search: string;
  dateRange: DateRange;
  status: EventStatus;
}

export function EventsFilters({
  search,
  dateRange,
  status,
}: EventsFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(search);
  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRange>(dateRange);
  const [selectedStatus, setSelectedStatus] = useState<EventStatus>(status);

  const debouncedSearch = useCallback((value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value === "") {
      params.delete("searchQuery");
    } else {
      params.set("searchQuery", value);
    }
    window.history.pushState(null, "", `?${params.toString()}`);
  }, []);

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setSelectedDateRange(range);
    const params = new URLSearchParams(window.location.search);
    if (range.from) {
      params.set("from", range.from.toISOString());
    } else {
      params.delete("from");
    }
    if (range.to) {
      params.set("to", range.to.toISOString());
    } else {
      params.delete("to");
    }
    window.history.pushState(null, "", `?${params.toString()}`);
  }, []);

  const handleStatusChange = useCallback((val: EventStatus) => {
    setSelectedStatus(val);
    const params = new URLSearchParams(window.location.search);
    params.set("status", val.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, debouncedSearch]);

  return (
    <div className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @3xl:grid-cols-3">
      <SearchInput
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="col-span-full @3xl:col-span-1"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from && dateRange.to ? (
              <>
                {formatDate(dateRange.from, "LLL dd, y")} -{" "}
                {formatDate(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              <span className="overflow-hidden">Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: selectedDateRange.from,
              to: selectedDateRange.to,
            }}
            onSelect={(range) =>
              handleDateRangeChange({
                from: range?.from,
                to: range?.to,
              })
            }
            initialFocus
          />
          <div className="border-border border-t p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                handleDateRangeChange({ from: undefined, to: undefined })
              }
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Select
        value={selectedStatus.toString()}
        onValueChange={(val) =>
          handleStatusChange(val as unknown as EventStatus)
        }
      >
        <SelectTrigger className="h-9 w-full select-none">
          <SelectValue placeholder="Event status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={EventStatus.ALL.toString()}>All events</SelectItem>
          <SelectItem value={EventStatus.CURRENT.toString()}>
            Current & upcoming
          </SelectItem>
          <SelectItem value={EventStatus.PAST.toString()}>
            Past events
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
