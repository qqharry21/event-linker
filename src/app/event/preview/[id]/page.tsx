import { EventDetail } from "@/components/EventDetail";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function EventPreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    return notFound();
  }

  const event = await prisma.event.findUnique({
    where: {
      id: params.id,
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
