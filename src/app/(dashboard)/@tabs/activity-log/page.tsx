import { auth } from "@clerk/nextjs/server";

export default async function OverviewPage() {
  const { userId } = await auth();

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  return <>Dashboard</>;
}
