import { CreateEventButton } from "./create-event-button";
import DashboardTab from "./dashboard-tab";

export const DashboardSidebar = () => {
  return (
    <div className="border-secondary flex h-full w-full flex-col bg-white p-4 max-md:border-b md:sticky md:top-20 md:min-h-[calc(100dvh-80px)] md:w-64 md:p-8 md:pb-12 md:pl-0">
      <DashboardTab />
      <CreateEventButton />
    </div>
  );
};
