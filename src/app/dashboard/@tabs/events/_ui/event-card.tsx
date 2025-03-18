import { format } from "date-fns";
import { CalendarDays, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Types } from "@/types/global";

interface EventCardProps {
  event: Types.Event;
}

export function EventCard({ event }: EventCardProps) {
  const isPastEvent = event.date < new Date();

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Badge variant={isPastEvent ? "secondary" : "default"}>
            {isPastEvent ? "Past" : "Upcoming"}
          </Badge>
        </div>
        <CardDescription className="mt-1 flex items-center">
          <CalendarDays className="mr-1 h-4 w-4" />
          {format(event.date, "EEEE, MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1 text-sm">
          {event.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center space-x-2">
            <Users className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Participants</span>
          </div>

          <div className="mt-2 flex items-center">
            <div className="mr-2 flex -space-x-2">
              {/* <TooltipProvider>
                {event.participants.slice(0, 5).map((participant) => (
                  <Tooltip key={participant.id}>
                    <TooltipTrigger asChild>
                      <Avatar className="border-background h-8 w-8 border-2">
                        <AvatarImage
                          src={participant.avatar}
                          alt={participant.name}
                        />
                        <AvatarFallback>
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{participant.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider> */}

              {/* {event.participants.length > 5 && (
                <Avatar className="border-background bg-muted h-8 w-8 border-2">
                  <AvatarFallback>
                    +{event.participants.length - 5}
                  </AvatarFallback>
                </Avatar>
              )} */}
            </div>
            <span className="text-muted-foreground text-sm">
              {/* {event.participants.length}{" "}
              {event.participants.length === 1 ? "person" : "people"} */}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button variant="ghost" size="sm">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
