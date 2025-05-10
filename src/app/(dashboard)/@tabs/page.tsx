import { EventsOverview } from "@/components/events-overview";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Events Overview",
  description: "Check out the events you've created and participated in",
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
export const dynamic = "force-dynamic";

const getEvents = async (userId: string, params: SearchParams) => {
  const currentDate = new Date().toISOString();
  const dateRangeCondition = {
    gte: params.from || undefined,
    lte: params.to || undefined,
  };

  let statusCondition = dateRangeCondition;
  if (params.status === "past") {
    statusCondition = { ...dateRangeCondition, lte: currentDate };
  } else if (params.status === "current" || !params.status) {
    statusCondition = { ...dateRangeCondition, gte: currentDate };
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
      ],
    },
    include: {
      participation: {
        include: { user: true },
      },
      createdBy: true,
    },
    orderBy: [
      { archived: "asc" },
      { date: "desc" },
      { startTime: "desc" },
      { createdAt: "desc" },
    ],
  });
};

export default async function Page(props: {
  searchParams: PromiseSearchParams;
}) {
  const searchParams = await props.searchParams;

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const events = await getEvents(userId, searchParams);

  if (!events) return <div>Something went wrong</div>;

  return <EventsOverview events={events} />;
}
