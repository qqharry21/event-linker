"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";

type Tab = {
  name: string;
  slug: string;
};

const tabs: Tab[] = [
  { name: "Dashboard", slug: "" },
  { name: "Events Overview", slug: "events" },
  { name: "Activity Log", slug: "activity-log" },
];

export default function DashboardTab() {
  const segment = useSelectedLayoutSegment("tabs");
  const targetIndex =
    tabs.findIndex((tab) => tab.slug === segment) !== -1
      ? tabs.findIndex((tab) => tab.slug === segment)
      : 0;

  const [activeIndex, setActiveIndex] = useState(targetIndex);

  useEffect(() => {
    console.log("render tab");

    setActiveIndex(targetIndex);
  }, [targetIndex]);

  return (
    <div className="scrollbar-hide w-full overflow-x-auto max-md:pb-1.5 md:flex-1">
      <div className="relative flex w-full items-center md:flex-col">
        {tabs.map((tab, index) => (
          <TabItem key={tab.name} tab={tab} isActive={index === activeIndex} />
        ))}
      </div>
    </div>
  );
}

const TabItem = ({ tab, isActive }: { tab: Tab; isActive: boolean }) => {
  return (
    <Link
      key={tab.name}
      href={`/${tab.slug.toLowerCase()}`}
      className={`group relative flex h-[30px] w-full cursor-pointer items-center justify-center px-6 py-2 text-sm whitespace-nowrap transition-all duration-300 md:justify-start ${
        isActive
          ? "text-foreground dark:text-white"
          : "text-muted-foreground dark:text-[#ffffff99]"
      }`}
    >
      {tab.name}

      {isActive && (
        <motion.span
          id="tab-indicator"
          layoutId="tab-indicator"
          className="absolute inset-x-0 -bottom-1.5 z-10 h-0.5 w-full bg-[#0e0f11] md:inset-y-0 md:right-0 md:h-full md:w-0.5 dark:bg-white"
        />
      )}
      <span className="absolute inset-0 z-10 rounded-lg bg-[#0e0f1114] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 md:rounded-l-none md:rounded-r-lg dark:bg-white" />
    </Link>
  );
};
