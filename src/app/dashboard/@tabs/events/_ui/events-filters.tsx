"use client";

import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center space-x-2">
        <Search className="text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9"
        />
      </div>

      <div>
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
                <span>Select date range</span>
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
      </div>

      <div>
        <Select
          value={eventStatus.toString()}
          onValueChange={(val) => setEventStatus(val as unknown as EventStatus)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Event status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All events</SelectItem>
            <SelectItem value="current">Current & upcoming</SelectItem>
            <SelectItem value="past">Past events</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-end">
        <Button>Create New Event</Button>
      </div>
    </div>
  );
}
