"use client";

import type { PhotoItem } from "@/types/photo";

type TimelineProps = {
  photos: PhotoItem[];
  activeDate?: string;
  onSelectDate: (dateKey?: string) => void;
};

function getDateKey(takenAt: string) {
  const date = new Date(takenAt);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function groupByDate(photos: PhotoItem[]) {
  const groups = new Map<string, number>();

  for (const photo of photos) {
    if (!photo.takenAt) continue;

    const key = getDateKey(photo.takenAt);
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }

  return Array.from(groups.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export default function Timeline({ photos, activeDate, onSelectDate }: TimelineProps) {
  const groups = groupByDate(photos);

  return (
    <aside className="sticky top-6 hidden max-h-[calc(100vh-3rem)] w-56 overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.03] p-4 lg:block">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Timeline</h2>
        <button
          type="button"
          onClick={() => onSelectDate(undefined)}
          className="text-xs text-cyan-300 hover:text-cyan-200"
        >
          Tất cả
        </button>
      </div>

      <div className="space-y-1">
        {groups.map((group) => {
          const isActive = group.date === activeDate;

          return (
            <button
              key={group.date}
              type="button"
              onClick={() => onSelectDate(group.date)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-cyan-400 text-zinc-950"
                  : "text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{group.date}</span>
              <span className="text-xs opacity-70">{group.count}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
