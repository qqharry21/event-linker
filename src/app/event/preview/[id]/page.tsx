import { EventDetail } from "@/components/event-detail";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function EventPreviewPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await currentUser();
  const userId = user?.id;
  console.log("🚨 - userId", userId);

  if (!userId) {
    return notFound();
  }

  const event = await prisma.event.findUnique({
    where: {
      id,
      createdById: userId,
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

  return <EventDetail event={event} isPreview={true} />;
}
