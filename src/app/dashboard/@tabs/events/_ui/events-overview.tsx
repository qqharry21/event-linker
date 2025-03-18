"use client";

import { Types } from "@/types/global";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { EventStatus } from "../type";
import { EventsFilters } from "./events-filters";
import { EventsGrid } from "./events-grid";
import { EventsHeader } from "./events-header";

export const EventsOverview = ({ events }: { events: Types.Event[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [eventStatus, setEventStatus] = useState<EventStatus>(EventStatus.ALL);

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDateRange =
          !dateRange.from ||
          !dateRange.to ||
          (event.date >= dateRange.from && event.date <= dateRange.to);

        const today = new Date();
        const isPastEvent = event.date < today;
        const matchesStatus =
          eventStatus === EventStatus.ALL ||
          (eventStatus === EventStatus.PAST && isPastEvent) ||
          (eventStatus === EventStatus.CURRENT && !isPastEvent);

        return matchesSearch && matchesDateRange && matchesStatus;
      }),
    [],
  );

  return (
    <div className="@container flex h-full flex-col">
      <div className="flex flex-col space-y-4 p-4 sm:p-6 lg:p-8">
        <EventsHeader />

        <EventsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateRange={dateRange}
          setDateRange={setDateRange}
          eventStatus={eventStatus}
          setEventStatus={setEventStatus}
        />

        <EventsGrid events={filteredEvents} />
      </div>
    </div>
  );
};
