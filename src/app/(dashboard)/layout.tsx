import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Header } from "@/components/header";

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
      <Header />
      <div className="container mx-auto md:flex">
        <DashboardSidebar />

        <main className="border-secondary w-full p-4 md:flex-1 md:border-l md:p-8">
          {tabs}
        </main>
      </div>
    </>
  );
}
