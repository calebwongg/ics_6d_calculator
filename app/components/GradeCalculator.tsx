"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { CATEGORIES, calcCategoryPct, calcCategoryPctByPoints, getLetterGrade } from "../data";
import CategorySection from "./CategorySection";

type AllScores = Record<string, Record<number, string>>;

const STORAGE_KEY = "ics6d-grades";

interface SavedState {
  scores: AllScores;
  finalExamScore: string;
  useFinal: boolean;
}

function loadFromStorage(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch {
    return null;
  }
}

function saveToStorage(state: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

export default function GradeCalculator() {
  const [scores, setScores] = useState<AllScores>(() => {
    const saved = loadFromStorage();
    if (saved) return saved.scores;
    const init: AllScores = {};
    const skipDefaults = new Set(["exams", "takeHome", "participation"]);
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      if (skipDefaults.has(key)) {
        init[key] = {};
      } else {
        const catScores: Record<number, string> = {};
        cat.assignments.forEach((a, i) => {
          if (cat.isCheckbox) {
            catScores[i] = "checked";
          } else {
            catScores[i] = String(a.max);
          }
        });
        init[key] = catScores;
      }
    }
    return init;
  });
  const [finalExamScore, setFinalExamScore] = useState(
    () => loadFromStorage()?.finalExamScore ?? ""
  );
  const [useFinal, setUseFinal] = useState(
    () => loadFromStorage()?.useFinal ?? false
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");

  // Auto-save on every change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveToStorage({ scores, finalExamScore, useFinal });
    }, 500);
    return () => clearTimeout(timeout);
  }, [scores, finalExamScore, useFinal]);

  const handleSave = useCallback(() => {
    saveToStorage({ scores, finalExamScore, useFinal });
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 1500);
  }, [scores, finalExamScore, useFinal]);

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

  // "By percentage" uses the existing calcCategoryPct (each midterm weighted equally)
  // "By points" pools all midterm points together
  const categoryResultsByPoints = useMemo(() => {
    const results: Record<string, number | null> = {};
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      if (key === "exams") {
        results[key] = calcCategoryPctByPoints(
          cat,
          scores[key] ?? {},
          finalExamScore,
          useFinal
        );
      } else {
        results[key] = categoryResults[key];
      }
    }
    return results;
  }, [scores, finalExamScore, useFinal, categoryResults]);

  const computeTotal = useCallback(
    (results: Record<string, number | null>) => {
      let total = 0;
      for (const [key, cat] of Object.entries(CATEGORIES)) {
        const pct = results[key];
        if (cat.isCheckbox) {
          total += (pct ?? 0) * cat.weight;
        } else if (pct !== null) {
          total += pct * cat.weight;
        }
      }
      return total;
    },
    []
  );

  const { gradeByPct, gradeByPoints } = useMemo(() => {
    const byPct = computeTotal(categoryResults);
    const byPoints = computeTotal(categoryResultsByPoints);
    return { gradeByPct: byPct, gradeByPoints: byPoints };
  }, [categoryResults, categoryResultsByPoints, computeTotal]);

  const getGradeColor = (grade: number) =>
    grade >= 90
      ? "text-emerald-400"
      : grade >= 80
        ? "text-blue-400"
        : grade >= 70
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

        <div className="pt-4 border-t border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">By Equal Percentage (each midterm = 1/3)</div>
              <span className={`text-3xl font-bold ${getGradeColor(gradeByPct)}`}>
                {gradeByPct.toFixed(2)}%
              </span>
              <span className="text-lg text-slate-400 ml-2">{getLetterGrade(gradeByPct)}</span>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">By Total Points (pooled midterm points)</div>
              <span className={`text-3xl font-bold ${getGradeColor(gradeByPoints)}`}>
                {gradeByPoints.toFixed(2)}%
              </span>
              <span className="text-lg text-slate-400 ml-2">{getLetterGrade(gradeByPoints)}</span>
            </div>
          </div>
          <p className="text-xs text-amber-400/80 text-center mt-3">
            Disclaimer: These are estimates. It is unclear whether the instructor calculates midterm grades
            by pooling total points or by weighting each midterm equally. Both methods are shown above.
          </p>
        </div>

        {/* Save button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {saveStatus === "saved" ? "Saved!" : "Save"}
          </button>
          <span className="ml-3 text-xs text-slate-500 self-center">
            Auto-saves as you type
          </span>
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
