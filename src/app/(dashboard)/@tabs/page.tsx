import { EventsOverview } from "@/components/events-overview";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";

export const metadata: Metadata = {
  title: "Events Overview",
};

type SearchParams = {
  archived?: string;
  from?: string;
  to?: string;
  searchQuery?: string;
  status?: "all" | "past" | "current";
};

type PromiseSearchParams = Promise<SearchParams>;

export const revalidate = 0;

const getEvents = cache(async (userId: string, params: SearchParams) => {
  //
  const currentDate = new Date().toISOString();
  const dateRangeCondition = {
    gte: params.from || undefined,
    lte: params.to || undefined,
  };

  let statusCondition = dateRangeCondition;

  if (params.status === "current") {
    statusCondition = { ...dateRangeCondition, gte: currentDate };
  } else if (params.status === "past") {
    statusCondition = { ...dateRangeCondition, lte: currentDate };
  }

  let archivedFilter = undefined;

  if (params.status === "all") {
    archivedFilter = undefined;
  } else if (params.status === "past") {
    archivedFilter = false;
  } else if (params.status === "current") {
    archivedFilter = false;
  }

  return prisma.event.findMany({
    where: {
      OR: [
        { createdById: userId },
        {
          participation: {
            some: { userId },
          },
        },
      ],
      AND: [
        {
          date: statusCondition,
        },
        {
          title: {
            contains: params.searchQuery,
            mode: "insensitive",
          },
        },
        {
          archived: archivedFilter,
        },
      ],
    },
    include: {
      participation: {
        include: { user: true },
      },
      createdBy: true,
    },
    orderBy: [{ date: "desc" }, { startTime: "desc" }, { createdAt: "desc" }],
  });
});

export default async function Page({
  searchParams,
}: {
  searchParams: PromiseSearchParams;
}) {
  const params = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const events = await getEvents(userId, params);

  if (!events) return <div>Something went wrong</div>;

  return <EventsOverview events={events} />;
}
