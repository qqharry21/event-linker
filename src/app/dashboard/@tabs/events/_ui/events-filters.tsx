"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { DateRange } from "react-day-picker";
import { EventStatus } from "../type";

interface EventsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: DateRange;
  setDateRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  eventStatus: EventStatus;
  setEventStatus: (status: EventStatus) => void;
}

export function EventsFilters({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  eventStatus,
  setEventStatus,
}: EventsFiltersProps) {
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
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
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
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range) =>
              setDateRange({
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
              onClick={() => setDateRange({ from: undefined, to: undefined })}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Select
        value={eventStatus.toString()}
        onValueChange={(val) => setEventStatus(val as unknown as EventStatus)}
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
