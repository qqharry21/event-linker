"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const tabs = [
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

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(targetIndex);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // Update activeStyle when activeIndex changes
    const activeElement = tabRefs.current[activeIndex];
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    // Set activeStyle for the initial render based on the targetIndex
    const initialActiveElement = tabRefs.current[targetIndex];
    if (initialActiveElement) {
      const { offsetLeft, offsetWidth } = initialActiveElement;
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  }, [targetIndex]); // Ensure this runs after targetIndex is set

  useEffect(() => {
    // Set hoverStyle when hoveredIndex changes
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  return (
    <div className="relative">
      {/* Hover Highlight */}
      <div
        className="absolute flex h-[30px] items-center rounded-[6px] bg-[#0e0f1114] transition-all duration-300 ease-out dark:bg-[#ffffff1a]"
        style={{
          ...hoverStyle,
          opacity: hoveredIndex !== null ? 1 : 0,
        }}
      />

      {/* Active Indicator */}
      <div
        className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] transition-all duration-300 ease-out dark:bg-white"
        style={activeStyle}
      />

      {/* Tabs */}
      <div className="relative flex items-center justify-center space-x-[6px]">
        {tabs.map((tab, index) => (
          <Link
            key={index}
            href={`/dashboard/${tab.slug.toLowerCase()}`}
            ref={(el) => {
              if (el) {
                tabRefs.current[index] = el;
              }
            }}
            className={`h-[30px] cursor-pointer px-3 py-2 transition-colors duration-300 ${
              index === activeIndex
                ? "text-[#0e0e10] dark:text-white"
                : "text-[#0e0f1199] dark:text-[#ffffff99]"
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setActiveIndex(index)}
          >
            <div className="flex h-full items-center justify-center text-sm leading-5 font-[var(--www-mattmannucci-me-geist-regular-font-family)] whitespace-nowrap">
              {tab.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
