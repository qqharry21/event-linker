import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";
import { EventsOverview } from "./_ui/events-overview";

export const metadata: Metadata = {
  title: "Events Overview",
};

export const revalidate = 0;

const getEvents = cache(async () => {
  const events = await prisma.event.findMany({
    orderBy: {
      startTime: "desc",
    },
  });
  console.log("🚨 - events", events);

  return events;
});

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const events = await getEvents();

  if (!events) return <div>Something went wrong</div>;

  return <EventsOverview events={events} />;
}
