import { Card } from "@/components/ui/card";
import { EventCard } from "./event-card";

const EventsEmpty = () => {
  return (
    <Card className="col-span-full flex h-[300px] items-center justify-center p-6">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold">No events found</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Try adjusting your search or filter criteria
        </p>
      </div>
    </Card>
  );
};

export function EventsGrid({
  events,
}: {
  events: (EventWithParticipation & EventWithCreator)[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 @2xl:grid-cols-2 @3xl:grid-cols-3 @7xl:grid-cols-4">
      {events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <EventsEmpty />
      )}
    </div>
  );
}
