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
  console.log("🚨 - userId", userId);

  if (!userId) {
    redirect("/");
  }

  const events = await prisma.event.findMany({});

  if (!events || events.length === 0) return <div>Empty</div>;

  return <EventsOverview events={events} />;
}
