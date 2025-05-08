"use client";

import { cn } from "@/lib/utils";
import {
  Event,
  EventParticipation,
  ParticipationStatus,
  User,
} from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface EventWithCreator extends Event {
  createdBy: User;
  participation: (EventParticipation & {
    user: User;
  })[];
}

interface EventDetailProps {
  event: EventWithCreator;
  isPreview?: boolean;
  currentUserId?: string | null;
}

async function updateParticipation(
  eventId: string,
  status: ParticipationStatus,
  comment: string,
) {
  const response = await fetch(`/api/events/${eventId}/participate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, comment }),
  });

  if (!response.ok) {
    throw new Error("Failed to update participation");
  }

  return response.json();
}

// 參與者頭像列表元件
function ParticipantsList({
  participants,
  currentUserId,
}: {
  participants: (EventParticipation & { user: User })[];
  currentUserId?: string | null;
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-wrap items-center justify-center gap-2">
      <TooltipProvider>
        {participants.map((participant) => (
          <Tooltip key={participant.userId}>
            <TooltipTrigger className="-translate-x-4 first:translate-x-0">
              <Avatar
                className={cn(
                  "ring-primary/30 h-8 w-8 ring-2 ring-offset-2",
                  participant.userId === currentUserId && "ring-primary",
                )}
              >
                <AvatarImage
                  src={participant.user.avatarUrl ?? ""}
                  alt={participant.user.displayName ?? ""}
                />
                <AvatarFallback>
                  {participant.user.displayName?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{participant.user.displayName ?? "Anonymous"}</p>
              {participant.comment && (
                <p className="text-muted-foreground text-xs">
                  &quot;{participant.comment}&quot;
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}

// 活動資訊欄元件
function EventInfoList({
  event,
  acceptedCount,
  userParticipation,
}: {
  event: EventWithCreator;
  acceptedCount: number;
  userParticipation: (EventParticipation & { user: User }) | null | undefined;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-[24px_auto_1fr] items-center gap-4">
        <CalendarIcon className="text-primary h-5 w-5" />
        <p className="font-medium whitespace-nowrap">時間：</p>
        <p className="text-muted-foreground">
          {format(event.date, "PPP")}
          {event.startTime && ` ${event.startTime}`}
        </p>
      </div>
      <div className="grid grid-cols-[24px_auto_1fr] items-center gap-4">
        <MapPinIcon className="text-primary h-5 w-5" />
        <p className="font-medium whitespace-nowrap">地點：</p>
        <p className="text-muted-foreground">{event.location}</p>
      </div>
      <div className="grid grid-cols-[24px_auto_1fr] items-center gap-4">
        <UsersIcon className="text-primary h-5 w-5" />
        <p className="font-medium whitespace-nowrap">參與人數：</p>
        <p className="text-muted-foreground">
          {acceptedCount} 人已確認參加
          {userParticipation?.status === "DECLINED" && `，您已婉拒參加`}
        </p>
      </div>
    </div>
  );
}

export function EventDetail({
  event,
  isPreview = false,
  currentUserId,
}: EventDetailProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [wantDecline, setWantDecline] = useState(false);

  const acceptedParticipants = useMemo(
    () => event.participation.filter((p) => p.status === "ACCEPTED"),
    [event.participation],
  );

  const userParticipation = useMemo(
    () =>
      currentUserId
        ? event.participation.find((p) => p.userId === currentUserId)
        : null,
    [currentUserId, event.participation],
  );

  const isCreator = currentUserId === event.createdById;

  const showParticipation = useMemo(
    () => !event.hideParticipants && acceptedParticipants.length > 0,
    [event.hideParticipants, acceptedParticipants],
  );

  const handleParticipation = async (status: ParticipationStatus) => {
    try {
      setIsSubmitting(true);
      await updateParticipation(event.id, status, comment);
      router.refresh();
      toast.success(status === "ACCEPTED" ? "成功接受邀請！" : "已婉拒邀請");
    } catch {
      toast.error("操作失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="bg-card/50 mx-auto h-full w-full max-w-xl overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="relative">
          {event.background && (
            <div
              className="absolute inset-0 h-32 w-full bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${event.background})` }}
            />
          )}
          <CardHeader className="relative space-y-4 pt-8 pb-4 text-center">
            {isPreview && (
              <Badge variant="secondary" className="absolute top-4 right-4">
                預覽模式
              </Badge>
            )}
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">誠摯邀請您參加</p>
              <h1 className="font-serif text-4xl font-bold tracking-tight">
                {event.title}
              </h1>
            </div>
            <Separator className="mx-auto w-1/3" />
          </CardHeader>
        </div>
        <CardContent className="mx-auto max-w-lg space-y-8">
          {event.description && (
            <div className="prose max-w-none text-center">
              <p className="text-lg">{event.description}</p>
            </div>
          )}
          <EventInfoList
            event={event}
            acceptedCount={acceptedParticipants.length}
            userParticipation={userParticipation}
          />
          {/* Participant List */}
          {showParticipation && (
            <ParticipantsList
              participants={acceptedParticipants}
              currentUserId={currentUserId}
            />
          )}
          {currentUserId && !isPreview && !isCreator && (
            <div
              className={cn(
                "flex flex-col gap-4",
                wantDecline && "flex-col-reverse",
              )}
            >
              {wantDecline && (
                <Button
                  variant="destructive"
                  onClick={() => handleParticipation("DECLINED")}
                  disabled={isSubmitting}
                >
                  確認婉拒
                </Button>
              )}
              {(userParticipation?.status === "PENDING" || wantDecline) && (
                <Textarea
                  placeholder="請填寫您的回覆訊息（選填）"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
              )}
              {userParticipation?.status !== "ACCEPTED" && (
                <Button
                  variant="default"
                  onClick={() => handleParticipation("ACCEPTED")}
                  disabled={isSubmitting}
                >
                  願意參加
                </Button>
              )}
              {userParticipation?.status !== "DECLINED" && !wantDecline && (
                <Button
                  variant="default"
                  onClick={() => setWantDecline(true)}
                  disabled={isSubmitting}
                >
                  婉拒邀請
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-muted-foreground text-center text-sm">
          <p className="w-full">
            活動發起人：{event.createdBy.displayName ?? "Anonymous"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
