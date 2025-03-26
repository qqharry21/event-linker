"use client";

import { format } from "date-fns";
import {
  Archive,
  CalendarDays,
  Clock,
  MapPin,
  Pencil,
  UserIcon,
  UserMinus,
  Users,
  X,
} from "lucide-react";

import { archiveEvent, closeEvent } from "@/app/actions/event";
import {
  removeParticipant,
  updateParticipationStatus,
} from "@/app/actions/event-participation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Types } from "@/types/global";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface EventCardProps {
  event: Types.Event & {
    participation: (Types.EventParticipation & {
      user: Types.User;
    })[];
    createdBy: {
      displayName: string | null;
    };
  };
}

export function EventCard({ event }: EventCardProps) {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isPastEvent = event.date < new Date();
  const isCreator = user?.id === event.createdById;
  const participation = event.participation.find((p) => p.userId === user?.id);
  const hasAccepted = participation?.status === "ACCEPTED";

  const handleEditEvent = () => {
    router.push(`/dashboard/events/${event.id}/edit`);
  };

  const handleArchiveEvent = async () => {
    try {
      setIsLoading(true);
      const result = await archiveEvent(event.id);

      if (result.status === 200) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to archive event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEvent = async () => {
    try {
      setIsLoading(true);
      const result = await closeEvent(event.id);

      if (result.status === 200) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to close event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      setIsLoading(true);
      const result = await updateParticipationStatus(event.id, "DECLINED");

      if (result.status === 200) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to decline event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      const result = await updateParticipationStatus(event.id, "PENDING");

      if (result.status === 200) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to join event");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveParticipantConfirm = async (participantId: string) => {
    try {
      setIsLoading(true);
      const result = await removeParticipant(participantId);

      if (result.status === 200) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to remove participant");
    } finally {
      setIsLoading(false);
    }
  };

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
    <Card className="relative flex h-full flex-col overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{event.title}</CardTitle>

          <Badge variant={isPastEvent ? "secondary" : "default"}>
            {isPastEvent ? "Past" : "Upcoming"}
          </Badge>
        </div>
        <CardDescription className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            <span className="text-muted-foreground text-sm">
              {format(event.date, "EEEE, MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-sm">
              {isCreator ? "Created by you" : "Created by someone else"}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
          {event.description === "" ? "No description" : event.description}
        </p>

        {(isCreator || !event.hideParticipants) && (
          <div className="mt-auto">
            <div className="flex items-center space-x-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">
                {event.participation.length} Participants
              </span>
            </div>

            <div className="mt-2 flex items-center">
              <div className="mr-2 flex -space-x-2">
                <TooltipProvider>
                  {event.participation.slice(0, 5).map((participant) => (
                    <Tooltip key={participant.id}>
                      <TooltipTrigger asChild>
                        <Avatar className="border-background h-8 w-8 border-2">
                          <AvatarImage
                            src={participant.user.avatarUrl ?? ""}
                            alt={participant.user.displayName ?? "User"}
                          />
                          <AvatarFallback>
                            {participant.user.displayName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{participant.user.displayName ?? "User"}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>

                {event.participation.length > 5 && (
                  <Avatar className="border-background bg-muted h-8 w-8 border-2">
                    <AvatarFallback>
                      +{event.participation.length - 5}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <span className="text-muted-foreground text-sm">
                {event.participation.length}{" "}
                {event.participation.length === 1 ? "person" : "people"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl">{event.title}</DialogTitle>
              </div>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    <span className="text-sm">
                      {format(event.date, "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                  <Badge variant={isPastEvent ? "secondary" : "default"}>
                    {isPastEvent ? "Past" : "Upcoming"}
                  </Badge>
                </div>
                {event.startTime && event.endTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    <span className="text-sm">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="size-4" />
                  <span className="text-sm">
                    Created by {event.createdBy.displayName}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
                  {event.description === ""
                    ? "No description"
                    : event.description}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 font-medium">
                  Participants ({event.participation.length})
                </h3>
                <div className="space-y-2">
                  {event.participation.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={participant.user.avatarUrl ?? ""}
                            alt={participant.user.displayName ?? "User"}
                          />
                          <AvatarFallback>
                            {participant.user.displayName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {participant.user.displayName}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {participant.status.charAt(0).toUpperCase() +
                              participant.status.slice(1).toLowerCase()}
                          </p>
                        </div>
                      </div>
                      {isCreator &&
                        participant.userId !== user?.id &&
                        participant.status !== "ACCEPTED" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <UserMinus className="size-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Participant
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove{" "}
                                  {participant.user.displayName || "User"} from
                                  this event? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleRemoveParticipantConfirm(
                                      participant.id,
                                    )
                                  }
                                  disabled={isLoading}
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              {isCreator && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleEditEvent}
                    disabled={isLoading}
                  >
                    <Pencil className="mr-2 size-4" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button disabled={isLoading}>Manage Event</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={handleCloseEvent}
                        disabled={isLoading}
                      >
                        <X className="mr-2 size-4" />
                        Close Event
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleArchiveEvent}
                        disabled={isLoading}
                      >
                        <Archive className="mr-2 size-4" />
                        Archive Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {isCreator ? (
          <Button variant="ghost" size="sm">
            Share
          </Button>
        ) : hasAccepted ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDecline}
            disabled={isLoading}
          >
            Decline
          </Button>
        ) : (
          !participation && (
            <Button
              variant="default"
              size="sm"
              onClick={handleJoin}
              disabled={isLoading}
            >
              Join
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}
