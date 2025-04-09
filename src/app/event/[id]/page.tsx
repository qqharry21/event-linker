import { EventDetail } from "@/components/EventDetail";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function EventPage(props: { params: { id: string } }) {
  const params = await props.params;
  const user = await currentUser();
  const userId = user?.id;

  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
      archived: false,
    },
    include: {
      createdBy: true,
      participation: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!event) {
    return notFound();
  }
  console.log("🚨 - event", event);

  return <EventDetail event={event} currentUserId={userId} />;
}
