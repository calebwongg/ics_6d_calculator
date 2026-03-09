"use client";

import { useState } from "react";
import { Category, getDroppedIndices } from "../data";

interface CategorySectionProps {
  catKey: string;
  category: Category;
  scores: Record<number, string>;
  onScoreChange: (index: number, value: string) => void;
  categoryPct: number | null;
  finalExamScore?: string;
  useFinal?: boolean;
  onFinalScoreChange?: (value: string) => void; //test
  onUseFinalChange?: (checked: boolean) => void;
}

export default function CategorySection({
  catKey,
  category,
  scores,
  onScoreChange,
  categoryPct,
  finalExamScore,
  useFinal,
  onFinalScoreChange,
  onUseFinalChange,
}: CategorySectionProps) {
  const [open, setOpen] = useState(false);

  const weightLabel = category.isExtraCredit
    ? `EC ${category.weight}%`
    : `${category.weight}%`;

  let displayPct: string;
  if (category.isCheckbox) {
    const checked = Object.values(scores).filter((v) => v === "checked").length;
    const total = category.assignments.length;
    displayPct = `${checked} / ${total}`;
  } else if (categoryPct === null) {
    displayPct = "--";
  } else {
    displayPct = `${(categoryPct * 100).toFixed(1)}%`;
  }

  // Calculate dropped indices for display
  const dropCount = category.dropLowest ?? 0;
  let droppedSet = new Set<number>();
  if (dropCount > 0) {
    const parsed = category.assignments.map((a, i) => {
      const val = parseFloat(scores[i] ?? "");
      if (!scores[i] || isNaN(val)) return 0;
      const isPct = a.usePercent || category.usePercent;
      return isPct ? val / 100 : a.max > 0 ? val / a.max : 0;
    });
    droppedSet = getDroppedIndices(parsed, dropCount);
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex justify-between items-center hover:bg-slate-750 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold">{category.title}</span>
          <span className="bg-slate-700 px-2 py-0.5 rounded text-xs text-slate-400">
            {weightLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-blue-400">{displayPct}</span>
          <span
            className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          >
            &#9660;
          </span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-4">
          {category.note && (
            <p className="text-xs text-slate-500 italic mb-3">
              {category.note}
            </p>
          )}

          {category.isCheckbox
            ? category.assignments.map((a, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 py-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={scores[i] === "checked"}
                    onChange={(e) =>
                      onScoreChange(i, e.target.checked ? "checked" : "")
                    }
                    className="w-4.5 h-4.5 accent-blue-400"
                  />
                  <span className="text-sm text-slate-300">{a.name}</span>
                </label>
              ))
            : category.assignments.map((a, i) => {
                const isPct = a.usePercent || category.usePercent;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 py-2 border-b border-slate-800 last:border-0"
                  >
                    <span className="flex-1 text-sm text-slate-300">
                      {a.name}
                      {droppedSet.has(i) && (
                        <span className="ml-2 text-[0.7rem] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                          dropped
                        </span>
                      )}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={a.max}
                      step="any"
                      placeholder="--"
                      value={scores[i] ?? ""}
                      onChange={(e) => onScoreChange(i, e.target.value)}
                      className="w-16 bg-slate-900 border border-slate-600 rounded-md px-2 py-1.5 text-center text-sm text-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    />
                    <span className="text-sm text-slate-500 w-16 text-right">
                      / {isPct ? "100%" : a.max}
                    </span>
                  </div>
                );
              })}

          {category.hasFinalReplacement && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <label className="flex items-center gap-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useFinal ?? false}
                  onChange={(e) => onUseFinalChange?.(e.target.checked)}
                  className="w-4.5 h-4.5 accent-blue-400"
                />
                <span className="text-sm text-slate-300">
                  Use Final Exam score to replace midterm average (if higher)
                </span>
              </label>
              {useFinal && (
                <div className="flex items-center gap-2.5 py-2">
                  <span className="flex-1 text-sm text-slate-300">
                    Final Exam Score
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="any"
                    placeholder="--"
                    value={finalExamScore ?? ""}
                    onChange={(e) => onFinalScoreChange?.(e.target.value)}
                    className="w-16 bg-slate-900 border border-slate-600 rounded-md px-2 py-1.5 text-center text-sm text-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                  <span className="text-sm text-slate-500 w-16 text-right">
                    / 100%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
