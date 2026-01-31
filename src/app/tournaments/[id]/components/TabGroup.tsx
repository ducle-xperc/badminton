"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabGroupProps {
  tabs: Tab[];
  defaultTab?: string;
  children: ReactNode[];
}

export function TabGroup({ tabs, defaultTab, children }: TabGroupProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  return (
    <div className="flex flex-col">
      {/* Tab Headers */}
      <div className="flex gap-2 overflow-x-auto hide-scroll px-6 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-card-dark border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">{children[activeIndex]}</div>
    </div>
  );
}
