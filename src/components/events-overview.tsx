"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { EventsFilters } from "./events-filters";
import { EventsGrid } from "./events-grid";
import { EventsHeader } from "./events-header";

export enum EventStatus {
  ALL = "all",
  PAST = "past",
  CURRENT = "current",
}

export const EventsOverview = ({
  events,
}: {
  events: (EventWithParticipation & EventWithCreator)[];
}) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("searchQuery") ?? "";
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";
  const status = searchParams.get("status") ?? "current";

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDateRange =
          !dateFrom ||
          !dateTo ||
          (event.date >= new Date(dateFrom) && event.date <= new Date(dateTo));

        const today = new Date();
        const isPastEvent = event.date < today;
        const matchesStatus =
          status === "all" ||
          (status === "past" && isPastEvent) ||
          (status === "current" && !isPastEvent);

        return matchesSearch && matchesDateRange && matchesStatus;
      }),
    [events, searchQuery, dateFrom, dateTo, status],
  );

  return (
    <div className="@container flex h-full flex-col">
      <div className="flex flex-col space-y-4 p-4 sm:p-6 lg:p-8">
        <EventsHeader />

        <EventsFilters
          search={searchQuery}
          dateRange={{
            from: dateFrom ? new Date(dateFrom) : undefined,
            to: dateTo ? new Date(dateTo) : undefined,
          }}
          status={status as EventStatus}
        />

        <EventsGrid events={filteredEvents} />
      </div>
    </div>
  );
};
