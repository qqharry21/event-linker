import DashboardTab from "@/components/dashboard-tab";

const title = "Dashboard";

export const metadata = {
  title,
  openGraph: {
    title,
  },
};

export default function Layout({ tabs }: { tabs: React.ReactNode }) {
  return (
    <div className="container mx-auto h-full min-h-[calc(100dvh-80px)] overflow-hidden md:flex">
      <DashboardTab />
      <main className="border-secondary w-full flex-1 border-l p-4 pt-0 md:p-6">
        {tabs}
      </main>
    </div>
  );
}
