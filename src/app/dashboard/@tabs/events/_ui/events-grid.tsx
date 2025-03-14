import { Card } from "@/components/ui/card";
import { Types } from "@/types/global";
import { EventCard } from "./event-card";

interface EventsGridProps {
  events: Types.Event[];
}

export function EventsGrid({ events }: EventsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <Card className="col-span-full flex h-[300px] items-center justify-center p-6">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold">No events found</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
