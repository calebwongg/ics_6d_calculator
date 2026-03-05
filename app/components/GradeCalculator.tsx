"use client";

import { useState, useMemo } from "react";
import { CATEGORIES, calcCategoryPct, getLetterGrade } from "../data";
import CategorySection from "./CategorySection";

type AllScores = Record<string, Record<number, string>>;

export default function GradeCalculator() {
  const [scores, setScores] = useState<AllScores>(() => {
    const init: AllScores = {};
    for (const key of Object.keys(CATEGORIES)) {
      init[key] = {};
    }
    return init;
  });

  const [finalExamScore, setFinalExamScore] = useState("");
  const [useFinal, setUseFinal] = useState(false);

  const handleScoreChange = (catKey: string, index: number, value: string) => {
    setScores((prev) => ({
      ...prev,
      [catKey]: { ...prev[catKey], [index]: value },
    }));
  };

  const categoryResults = useMemo(() => {
    const results: Record<string, number | null> = {};
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      results[key] = calcCategoryPct(
        cat,
        scores[key] ?? {},
        key === "exams" ? finalExamScore : undefined,
        key === "exams" ? useFinal : undefined
      );
    }
    return results;
  }, [scores, finalExamScore, useFinal]);

  const { finalGrade, letterGrade } = useMemo(() => {
    let total = 0;
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      const pct = categoryResults[key];
      if (cat.isCheckbox) {
        total += (pct ?? 0) * cat.weight;
      } else if (pct !== null) {
        total += pct * cat.weight;
      }
    }
    return { finalGrade: total, letterGrade: getLetterGrade(total) };
  }, [categoryResults]);

  const gradeColor =
    finalGrade >= 90
      ? "text-emerald-400"
      : finalGrade >= 80
        ? "text-blue-400"
        : finalGrade >= 70
          ? "text-amber-400"
          : "text-red-400";

  return (
    <div className="max-w-[900px] mx-auto px-5 py-5">
      <h1 className="text-center text-3xl font-bold text-blue-400 mb-1">
        ICS 6D Grade Calculator
      </h1>
      <p className="text-center text-slate-400 text-sm mb-6">
        Winter 2026 &mdash; Discrete Mathematics for Computer Science
      </p>

      {/* Sticky Summary */}
      <div className="sticky top-2.5 z-50 bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const pct = categoryResults[key];
            let displayVal: string;
            if (cat.isCheckbox) {
              const checked = Object.values(scores[key] ?? {}).filter(
                (v) => v === "checked"
              ).length;
              displayVal = `${checked} / ${cat.assignments.length}`;
            } else if (pct === null) {
              displayVal = "--";
            } else {
              displayVal = `${(pct * 100).toFixed(1)}%`;
            }

            const label = cat.isExtraCredit
              ? cat.title.replace(" (Extra Credit)", "") + " (EC)"
              : cat.title;

            return (
              <div
                key={key}
                className="bg-slate-900 px-3 py-2.5 rounded-lg flex justify-between items-center text-sm"
              >
                <span className="text-slate-400 truncate mr-2">{label}</span>
                <span className="font-semibold text-blue-400 shrink-0">
                  {displayVal}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4 border-t border-slate-700">
          <span className={`text-4xl font-bold ${gradeColor}`}>
            {finalGrade.toFixed(2)}%
          </span>
          <span className="text-xl text-slate-400 ml-2">{letterGrade}</span>
          <div className="text-xs text-slate-500 mt-1">
            Estimated Final Grade
          </div>
        </div>
      </div>

      {/* Category Sections */}
      {Object.entries(CATEGORIES).map(([key, cat]) => (
        <CategorySection
          key={key}
          catKey={key}
          category={cat}
          scores={scores[key] ?? {}}
          onScoreChange={(i, v) => handleScoreChange(key, i, v)}
          categoryPct={categoryResults[key]}
          {...(key === "exams"
            ? {
                finalExamScore,
                useFinal,
                onFinalScoreChange: setFinalExamScore,
                onUseFinalChange: setUseFinal,
              }
            : {})}
        />
      ))}
    </div>
  );
}
