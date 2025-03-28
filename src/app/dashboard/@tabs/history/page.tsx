import { sleep } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function OverviewPage() {
  const { userId } = await auth();

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();
  console.log("🚨 - user", user);

  await sleep(5000);
  return <>Dashboard</>;
}
