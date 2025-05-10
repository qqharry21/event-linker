"use client";

import { useUser } from "@clerk/nextjs";
import { formatDate } from "date-fns";
import {
  ArchiveIcon,
  CalendarIcon,
  Clock,
  ForwardIcon,
  LinkIcon,
  MailIcon,
  MapPin,
  PencilIcon,
  SettingsIcon,
  ShareIcon,
  Users,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { archiveEvent } from "@/actions/event";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { removeParticipant } from "@/actions/event-participation";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, isValidUrl, toUTCDateOnly } from "@/lib/utils";
import { Types } from "@/types/global";

interface Attendee extends Types.User {
  status: string;
}
function OrganizerInfo({ createdBy }: { createdBy: Types.User }) {
  return (
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
  );
}

function AttendeesList({
  attendees,
  userId,
  isPastEvent,
  isLoading,
  onRemove,
}: {
  attendees: Attendee[];
  userId: string;
  isPastEvent: boolean;
  isLoading: boolean;
  onRemove: (id: string) => void;
}) {
  if (attendees.length === 0) {
    return (
      <p className="text-muted-foreground h-[100px] text-sm">
        No attendees yet, be the first to attend!
      </p>
    );
  }
  return (
    <ScrollArea className="h-[100px] rounded-md border p-2">
      <div className="space-y-2">
        {attendees.map((attendee) => (
          <div key={attendee.id} className="group flex items-center gap-2">
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
                {attendee.status === "ACCEPTED" ? " - Accepted" : " - Declined"}
              </span>
            </span>
            {!isPastEvent && (
              <button
                className="ml-auto cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                type="button"
                aria-label="Remove participant"
                disabled={isLoading}
                onClick={() => onRemove(attendee.id as string)}
              >
                <XIcon className="text-destructive h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function EventShareActions({
  isPastEvent,
  mailtoLink,
  handleClickShareVia,
  handleCopyLink,
}: {
  isPastEvent: boolean;
  mailtoLink: string;
  handleClickShareVia: () => void;
  handleCopyLink: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-1/2"
          disabled={isPastEvent}
        >
          <ShareIcon />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={mailtoLink} prefetch={false}>
            <MailIcon />
            Email
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClickShareVia}>
          <ForwardIcon />
          Share via ...
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EventActions({
  isOrganizer,
  isPastEvent,
  isLoading,
  eventId,
  handleArchiveEvent,
}: {
  isOrganizer: boolean;
  isPastEvent: boolean;
  isLoading: boolean;
  eventId: string;
  handleArchiveEvent: () => void;
}) {
  return isOrganizer ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-1/2">
          <SettingsIcon />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!isPastEvent && (
          <DropdownMenuItem asChild>
            <Link href={`/event/${eventId}/edit`} prefetch={false}>
              <PencilIcon />
              Edit
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleArchiveEvent} disabled={isLoading}>
          <ArchiveIcon />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button
      variant="default"
      size="sm"
      className={cn("w-1/2", isPastEvent && "pointer-events-none opacity-50")}
      asChild
    >
      <Link href={`/event/${eventId}`} prefetch={false}>
        <PencilIcon />
        Regret
      </Link>
    </Button>
  );
}

export function EventCard({
  event,
}: {
  event: EventWithParticipation & EventWithCreator;
}) {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    id: eventId,
    date,
    endDate,
    title,
    location,
    startTime,
    endTime,
    createdBy,
    participation,
    hideParticipants,
    description,
  } = event;

  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}`;
  const isOrganizer = createdBy.id === user?.id;
  const isArchived = event.archived;
  const isLocationLink = isValidUrl(location);

  const attendees = useMemo(
    () =>
      participation
        .filter((p) => p.userId !== createdBy.id)
        .map((p) => ({ ...p.user, status: p.status })),
    [participation, createdBy.id],
  );

  const mailtoLink = useMemo(() => {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/event/${eventId}`;
    return `mailto:?subject=${encodeURIComponent(
      `Invitation: ${title}`,
    )}&body=${encodeURIComponent(
      `Hi,\n\nYou're invited to the following event:\nTitle: ${title}\nDate & Time: ${formatDate(date, "PP - EEE")}\nLocation: ${location}\nOrganizer: ${createdBy.displayName}\n\nMore details and RSVP: ${link}\n\nHope to see you there!`,
    )}`;
  }, [title, location, date, createdBy, eventId]);

  const utcDate = toUTCDateOnly(date);

  const isPastEvent = utcDate < new Date();

  const handleAsyncAction = async (
    action: () => Promise<{ status: number; message: string }>,
    successMsg: string,
    errorMsg: string,
  ) => {
    try {
      setIsLoading(true);
      const result = await action();
      if (result.status === 200) {
        toast.success(result.message || successMsg);
        router.refresh();
      } else {
        toast.error(result.message || errorMsg);
      }
    } catch (error) {
      console.error(error);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShareVia = async () => {
    if (isPastEvent) return;
    try {
      await navigator.share({
        title,
        text: `Invitation: ${title}`,
        url: link,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyLink = () => {
    if (isPastEvent) return;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  const handleArchiveEvent = () =>
    handleAsyncAction(
      () => archiveEvent(eventId),
      "Event archived",
      "Failed to archive event",
    );

  const handleRemoveParticipantConfirm = (participantId: string) =>
    handleAsyncAction(
      () => removeParticipant(participantId),
      "Participant removed",
      "Failed to remove participant",
    );

  if (!isLoaded)
    return (
      <Card className="flex h-full flex-col overflow-hidden">
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );

  return (
    <div className="flex flex-wrap items-stretch gap-6">
      <Card className="relative flex min-h-[400px] w-full flex-col overflow-hidden shadow-lg">
        {isArchived && (
          <div className="absolute top-0 right-0 z-10 size-[100px]">
            <div className="bg-primary text-primary-foreground absolute top-[20px] -right-[42px] flex w-[150px] rotate-45 items-center justify-center py-1 text-center text-xs shadow-[0_2px_4px_rgba(0,_0,_0,_0.2)]">
              Archived
            </div>
          </div>
        )}
        <CardHeader className="flex-1 pb-4">
          <CardTitle className="pr-9 text-xl">{title}</CardTitle>

          <CardDescription
            className="text-muted-foreground line-clamp-2"
            title={description ?? "Let's meet up and have some fun!"}
          >
            {description ?? "Let's meet up and have some fun!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          {/* Date & Time */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <CalendarIcon className="text-muted-foreground h-4 w-4" />
              <span className="font-medium">Date:</span>
              <time dateTime={utcDate.toISOString()}>
                {formatDate(utcDate, "EE, PP")}
                {endDate && ` - ${formatDate(endDate, "EE, PP")}`}
              </time>
            </div>

            {startTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">Time:</span>
                <span>
                  {startTime}
                  {endTime && ` - ${endTime}`}
                </span>
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
          <OrganizerInfo createdBy={createdBy} />

          <Separator />

          {/* Attendees */}
          {hideParticipants ? (
            <p className="text-muted-foreground text-sm">
              Attendees will be revealed after the event
            </p>
          ) : (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Users className="text-muted-foreground h-4 w-4" />
                <h3 className="text-sm font-medium">
                  Attendees ({attendees.length})
                </h3>
              </div>
              <AttendeesList
                attendees={attendees}
                userId={user?.id ?? ""}
                isPastEvent={isPastEvent}
                isLoading={isLoading}
                onRemove={handleRemoveParticipantConfirm}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-2 pt-0">
          <EventShareActions
            isPastEvent={isPastEvent}
            mailtoLink={mailtoLink}
            handleClickShareVia={handleClickShareVia}
            handleCopyLink={handleCopyLink}
          />
          <EventActions
            isOrganizer={isOrganizer}
            isPastEvent={isPastEvent}
            isLoading={isLoading}
            eventId={eventId}
            handleArchiveEvent={handleArchiveEvent}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
