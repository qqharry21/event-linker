import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function getActivityLogs(userId: string) {
  const activityLogs = await prisma.activityLog.findMany({
    where: {
      userId,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  return activityLogs;
}

export default async function OverviewPage() {
  const { userId } = await auth();
  console.log("🚨 - userId", userId);

  // Protect the route by checking if the user is signed in
  if (!userId) {
    redirect("/sign-in");
  }

  const activityLogs = await getActivityLogs(userId);

  return <DataTable columns={columns} data={activityLogs} />;
}
