"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";

type Tab = {
  name: string;
  slug: string;
};

const tabs: Tab[] = [
  { name: "Overview", slug: "" },
  { name: "Events", slug: "events" },
  { name: "History", slug: "history" },
  { name: "Profile", slug: "profile" },
];

export default function DashboardTab() {
  const segment = useSelectedLayoutSegment("tabs");
  const targetIndex =
    tabs.findIndex((tab) => tab.slug === segment) !== -1
      ? tabs.findIndex((tab) => tab.slug === segment)
      : 0;

  const [activeIndex, setActiveIndex] = useState(targetIndex);

  return (
    <div className="sticky top-0 flex h-full w-full bg-white p-4 md:w-64 md:p-4">
      <div className="scrollbar-hide w-full overflow-x-auto max-md:pb-1.5">
        <div className="relative flex w-full items-center md:flex-col">
          {tabs.map((tab, index) => (
            <TabItem
              key={tab.name}
              tab={tab}
              isActive={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const TabItem = ({
  tab,
  isActive,
  onClick,
}: {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Link
      key={tab.name}
      href={`/dashboard/${tab.slug.toLowerCase()}`}
      className={`group relative flex h-[30px] w-full cursor-pointer items-center justify-center px-6 py-2 text-sm transition-all duration-300 md:justify-start ${
        isActive
          ? "text-foreground dark:text-white"
          : "text-muted-foreground dark:text-[#ffffff99]"
      }`}
      onClick={onClick}
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
