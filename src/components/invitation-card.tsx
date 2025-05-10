"use client";

import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useState } from "react";

import { updateParticipation } from "@/actions/event-participation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EventDetailProps {
  event: EventWithParticipation & EventWithCreator;
  userId: string;
}

const checkLocationLink = (location: string) => {
  return location.includes("http") || location.includes("https");
};

export default function InvitationCard({ event, userId }: EventDetailProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const {
    date,
    title,
    location,
    startTime,
    createdBy,
    description,
    participation,
    hideParticipants,
  } = event;

  const isOrganizer = createdBy.id === userId;
  const isLocationLink = checkLocationLink(location);

  const attendees = participation
    .filter((participation) => participation.userId !== createdBy.id)
    .map((participation) => ({
      ...participation.user,
      status: participation.status,
    }));

  const isAttending = participation.some(
    (participation) =>
      participation.userId === userId && participation.status === "ACCEPTED",
  );

  const handleAccept = async () => {
    try {
      setIsSubmitting(true);
      const result = await updateParticipation(event.id, "ACCEPTED", "");
      if (result.status === 200) {
        toast.success("You have accepted the invitation");
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept the invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    try {
      setIsSubmitting(true);
      await updateParticipation(event.id, "DECLINED", declineReason);
      router.refresh();
      toast.success("You have declined the invitation");
      setOpen(false);
      setDeclineReason("");
    } catch {
      toast.error("Failed to decline the invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted/20 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date & Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="text-muted-foreground h-4 w-4" />
              <span className="font-medium">Date:</span>
              <time dateTime={date.toISOString()}>
                {formatDate(date, "PPP - EEEE")}
              </time>
            </div>

            {startTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">Time:</span>
                <span>{startTime}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
            <span className="font-medium">Location:</span>
            <Link
              href={
                isLocationLink
                  ? location
                  : "https://maps.google.com/?q=${location}"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {isLocationLink ? "Google Maps" : location}
            </Link>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-3 pt-2">
            <Avatar>
              <AvatarImage
                src={createdBy.avatarUrl ?? "/placeholder.svg"}
                alt={createdBy.displayName ?? "User Avatar"}
              />
              <AvatarFallback>
                {createdBy.displayName?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{createdBy.displayName}</p>
              <p className="text-muted-foreground text-xs">Organizer</p>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Attendees */}
          {hideParticipants ? (
            <p className="text-muted-foreground text-sm">
              Attendees will be revealed after the event
            </p>
          ) : (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Users className="text-muted-foreground h-4 w-4" />
                <h3 className="text-sm font-medium">
                  Attendees ({attendees.length})
                </h3>
              </div>
              <ScrollArea className="h-[100px] rounded-md border p-2">
                <div className="space-y-2">
                  {attendees.length > 0 ? (
                    attendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={attendee.avatarUrl ?? "/placeholder.svg"}
                            alt={attendee.displayName ?? "User Avatar"}
                          />
                          <AvatarFallback>
                            {attendee.displayName?.charAt(0) ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {attendee.displayName}
                          {attendee.id === userId && " (You)"}
                          <span className="text-muted-foreground text-xs">
                            {attendee.status === "ACCEPTED"
                              ? " - Accepted"
                              : " - Declined"}
                          </span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No attendees yet, be the first to attend!
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>

        {!isOrganizer && (
          <CardFooter className="flex justify-between gap-2 pt-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant={isAttending ? "default" : "outline"}
                  className={isAttending ? "w-full" : "w-1/2"}
                >
                  {isAttending ? "Cancel" : "Decline"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Decline Invitation</DialogTitle>
                  <DialogDescription>
                    Please let us know why you can&apos;t attend this
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder="Enter your reason here..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="min-h-[100px]"
                />
                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleDecline} disabled={isSubmitting}>
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {!isAttending && (
              <Button
                className="w-1/2"
                onClick={handleAccept}
                disabled={isSubmitting}
              >
                Accept
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
