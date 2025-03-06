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
      <div className="container mx-auto my-4 flex items-center justify-center">
        <DashboardTab />
      </div>
      <main className="w-full px-4 md:mt-6 md:px-6">
        <div className="container mx-auto overflow-hidden">{tabs}</div>
      </main>
    </>
  );
}
