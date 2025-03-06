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
    <div className="sticky top-20 z-[9] bg-white p-4 pt-2 shadow-sm md:p-4">
      <div className="scrollbar-hide w-full overflow-x-auto pb-1.5">
        <div className="relative container mx-auto flex w-fit items-center">
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
      className={`group relative h-[30px] cursor-pointer px-3 py-2 transition-all duration-300 ${
        isActive
          ? "text-foreground dark:text-white"
          : "text-[#0e0f1199] dark:text-[#ffffff99]"
      }`}
      onClick={onClick}
    >
      <span className="flex h-full items-center justify-center text-sm">
        {tab.name}
      </span>

      {isActive && (
        <motion.span
          id="tab-indicator"
          layoutId="tab-indicator"
          className="absolute inset-x-0 bottom-[-6px] z-10 h-[2px] w-full bg-[#0e0f11] dark:bg-white"
        />
      )}
      <span className="absolute inset-0 z-10 rounded-lg bg-[#0e0f1114] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 dark:bg-white" />
    </Link>
  );
};
