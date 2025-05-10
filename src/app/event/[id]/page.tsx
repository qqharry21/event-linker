import InvitationCard from "@/components/invitation-card";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function EventPage({ params }: { params: Params }) {
  const { id } = await params;
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    return redirect("/sign-in");
  }

  const event = await prisma.event.findUnique({
    where: {
      id,
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

  return <InvitationCard event={event} userId={userId} />;
}
