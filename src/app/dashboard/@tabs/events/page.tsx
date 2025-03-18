import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { EventsOverview } from "./_ui/events-overview";

export const metadata: Metadata = {
  title: "Events Overview",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const events = await prisma.event.findMany({
    orderBy: {
      startTime: "desc",
    },
  });

  if (!events) return <div>Something went wrong</div>;

  return <EventsOverview events={events} />;
}
