export interface Assignment {
  name: string;
  max: number;
  usePercent?: boolean;
}

export interface Category {
  title: string;
  weight: number;
  assignments: Assignment[];
  note?: string;
  usePercent?: boolean;
  dropLowest?: number;
  isCheckbox?: boolean;
  isExtraCredit?: boolean;
  hasFinalReplacement?: boolean;
}

export const CATEGORIES: Record<string, Category> = {
  lectures: {
    title: "Lecture Comprehension Checks",
    weight: 4,
    assignments: [
      { name: "Lecture 1.1: Sequences", max: 5 },
      { name: "Lecture 1.2: Sums", max: 1 },
      { name: "Lecture 1.3: Math Induction", max: 7 },
      { name: "Lecture 2.1: Strong Induction", max: 2 },
      { name: "Lecture 3.1: Structural Induction", max: 2 },
      { name: "Lecture 3.2: Recursion", max: 4 },
      { name: "Lecture 4.1: Counting Intro", max: 4 },
      { name: "Lecture 4.2: Permutations", max: 4 },
      { name: "Lecture 5.1: Counting Subsets", max: 5 },
      { name: "Lecture 5.2: Counting by Complement", max: 1 },
      { name: "Lecture 5.3: Permutations with Repetitions", max: 5 },
      { name: "Lecture 6.1: Subsets with Repetitions", max: 3 },
      { name: "Lecture 6.2: Balls and Bins", max: 3 },
      { name: "Lecture 6.3: Inclusion-Exclusion Principle", max: 3 },
      { name: "Lecture 7.1: Modular Arithmetic", max: 4 },
      { name: "Lecture 7.2: Divisibility", max: 2 },
      { name: "Lecture 7.3: GCD", max: 8 },
      { name: "Lecture 8.1: Number Representation", max: 5 },
      { name: "Lecture 8.2: Fermat, Euler, CRT", max: 4 },
      { name: "Lecture 8.3: Intro to Cryptography and RSA", max: 4 },
      { name: "Lecture 9: Binomial Coefficients and Identities", max: 3 },
      { name: "Lecture 9: Generating Functions", max: 4 },
      { name: "Lecture 9: Probability", max: 4 },
    ],
  },
  ica: {
    title: "In-Class Activities",
    weight: 4,
    assignments: [
      { name: "Week 1 In-Class Activity", max: 1 },
      { name: "Week 2 In-Lecture Activity", max: 1 },
      { name: "Week 3 In-Lecture Activity", max: 1 },
      { name: "Week 4 In-Lecture Activity", max: 1 },
      { name: "Week 5 In-Lecture Activity", max: 1 },
      { name: "Week 6 In-Lecture Activity", max: 1 },
      { name: "Week 7 In-Lecture Activity", max: 1 },
      { name: "Week 8 In-Lecture Activity", max: 1 },
      { name: "Week 9 In-Lecture Activity", max: 1 },
    ],
  },
  zybook: {
    title: "zyBook (Readings)",
    weight: 4,
    note: "Participation & challenge activities. Enter percentage completed for each week.",
    usePercent: true,
    assignments: [
      { name: "Reading Week 1", max: 100 },
      { name: "Reading Week 2", max: 100 },
      { name: "Reading Week 3", max: 100 },
      { name: "Reading Week 4", max: 100 },
      { name: "Reading Week 5", max: 100 },
      { name: "Reading Week 6", max: 100 },
      { name: "Reading Week 7", max: 100 },
      { name: "Reading Week 8", max: 100 },
      { name: "Reading Week 9", max: 100 },
    ],
  },
  readingQuizzes: {
    title: "Reading Quizzes",
    weight: 4,
    assignments: [
      { name: "Reading Quiz 1", max: 6 },
      { name: "Reading Quiz 2", max: 5 },
      { name: "Reading Quiz 3", max: 5 },
      { name: "Reading Quiz 4", max: 5 },
      { name: "Reading Quiz 5", max: 6 },
      { name: "Reading Quiz 6", max: 5 },
      { name: "Reading Quiz 7", max: 5 },
      { name: "Reading Quiz 8", max: 6 },
      { name: "Reading Quiz 9", max: 6 },
    ],
  },
  homework: {
    title: "Homework",
    weight: 4,
    note: "Best 8 of 9 counted (lowest score dropped). Enter percentage score.",
    dropLowest: 1,
    usePercent: true,
    assignments: [
      { name: "Homework 1", max: 100 },
      { name: "Homework 2", max: 100 },
      { name: "Homework 3", max: 100 },
      { name: "Homework 4", max: 100 },
      { name: "Homework 5", max: 100 },
      { name: "Homework 6", max: 100 },
      { name: "Homework 7", max: 100 },
      { name: "Homework 8", max: 100 },
      { name: "Homework 9", max: 100 },
    ],
  },
  takeHome: {
    title: "Take-Home Exams",
    weight: 4,
    note: "Best 8 of 9 counted (lowest score dropped).",
    dropLowest: 1,
    assignments: [
      { name: "Take Home Exam 1", max: 18 },
      { name: "Take Home Exam 2", max: 20 },
      { name: "Take Home Exam 3", max: 15 },
      { name: "Take Home Exam 4", max: 20 },
      { name: "Take Home Exam 5", max: 19 },
      { name: "Take Home Exam 6", max: 20 },
      { name: "Take Home Exam 7", max: 20 },
      { name: "Take Home Exam 8", max: 20 },
      { name: "Take Home Exam 9", max: 100, usePercent: true },
    ],
  },
  exams: {
    title: "Midterm Exams",
    weight: 75,
    note: "Optional final exam can replace midterm average if higher.",
    hasFinalReplacement: true,
    assignments: [
      { name: "Midterm 1", max: 30 },
      { name: "Midterm 2", max: 26 },
      { name: "Midterm 3", max: 100, usePercent: true },
    ],
  },
  feedback: {
    title: "Course Feedback",
    weight: 1,
    note: "0.5% for Midterm Course Feedback + 0.5% for Final Course Evaluation.",
    isCheckbox: true,
    assignments: [
      { name: "Midterm Course Feedback", max: 50 },
      { name: "Final Course Evaluation", max: 50 },
    ],
  },
  participation: {
    title: "In-Class Participation (Extra Credit)",
    weight: 2,
    isExtraCredit: true,
    note: "Extra credit. Enter number of participation sessions attended out of 18.",
    assignments: [{ name: "Participation Sessions Attended", max: 18 }],
  },
};

export function getLetterGrade(pct: number): string {
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 63) return "D";
  if (pct >= 60) return "D-";
  return "F";
}

export function getDroppedIndices(
  scores: (number | null)[],
  dropCount: number
): Set<number> {
  if (dropCount === 0) return new Set();
  const indexed = scores.map((s, i) => ({ idx: i, val: s ?? 0 }));
  indexed.sort((a, b) => a.val - b.val);
  const dropped = new Set<number>();
  for (let d = 0; d < dropCount && d < indexed.length; d++) {
    dropped.add(indexed[d].idx);
  }
  return dropped;
}

export function calcCategoryPct(
  cat: Category,
  scores: Record<number, string>,
  finalExamScore?: string,
  useFinal?: boolean
): number | null {
  if (cat.isCheckbox) {
    let earned = 0;
    cat.assignments.forEach((a, i) => {
      if (scores[i] === "checked") earned += a.max;
    });
    return earned / 100;
  }

  // Parse each score to a 0-1 fraction
  const isPercent = (a: Assignment) => a.usePercent || cat.usePercent;
  const parsed = cat.assignments.map((a, i) => {
    const val = parseFloat(scores[i] ?? "");
    if (scores[i] === "" || scores[i] === undefined || isNaN(val)) return null;
    return isPercent(a) ? val / 100 : a.max > 0 ? val / a.max : 0;
  });

  const filledCount = parsed.filter((v) => v !== null).length;
  if (filledCount === 0) return null;

  const withZeros = parsed.map((v) => v ?? 0);

  // Final exam replacement for midterms
  if (cat.hasFinalReplacement && useFinal && finalExamScore) {
    const finalVal = parseFloat(finalExamScore);
    if (!isNaN(finalVal)) {
      const midtermAvg =
        withZeros.reduce((s, x) => s + x, 0) / (filledCount || 1);
      const finalPct = finalVal / 100;
      if (finalPct > midtermAvg) return finalPct;
    }
  }

  const dropCount = cat.dropLowest ?? 0;
  const dropped = getDroppedIndices(withZeros, dropCount);

  // Average the fractions (works for both points-based and percent-based)
  let sum = 0;
  let count = 0;
  withZeros.forEach((s, i) => {
    if (!dropped.has(i)) {
      sum += s;
      count++;
    }
  });
  return count > 0 ? sum / count : null;
}
