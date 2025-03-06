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
    <>
      <DashboardTab />

      <main className="mt-4 w-full px-4 md:mt-6 md:px-6">
        <div className="container mx-auto overflow-hidden">{tabs}</div>
      </main>
    </>
  );
}
