"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Attempt = {
  id: string;
  problemId: string;
  status: string;
  score: number | null;
  createdAt: string;
  problem: {
    id: string;
    title: string;
    difficulty: string;
  };
  evaluation: {
    overallScore: number;
    summary: string;
  } | null;
};

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/attempts/history", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load attempt history."
        );
      }

      setAttempts(data);
    } catch (err) {
      console.error("History error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load history."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  const completedAttempts = useMemo(
    () =>
      attempts.filter(
        (attempt) =>
          attempt.status === "COMPLETED" &&
          attempt.score !== null
      ),
    [attempts]
  );

  const averageScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce(
            (total, attempt) => total + (attempt.score ?? 0),
            0
          ) / completedAttempts.length
        )
      : 0;

  const completedProblems = new Set(
    completedAttempts.map((attempt) => attempt.problemId)
  ).size;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold">
            LLD<span className="text-blue-400">Forge</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Problems
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-12">
        <p className="text-sm font-medium text-blue-400">
          Practice History
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          My Attempts
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Review your previous LLD attempts, understand your
          weaknesses and try again to improve your score.
        </p>
      </section>

      {/* Loading */}
      {loading && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="mt-4 text-slate-400">
              Loading your attempts...
            </p>
          </div>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <h2 className="font-semibold text-red-300">
              Could not load history
            </h2>

            <p className="mt-2 text-sm text-red-300/80">
              {error}
            </p>

            <button
              onClick={loadHistory}
              className="mt-5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </section>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Stats */}
          <section className="mx-auto grid max-w-6xl gap-4 px-6 md:grid-cols-3">
            <StatCard
              title="Total Attempts"
              value={attempts.length.toString()}
            />

            <StatCard
              title="Average Score"
              value={averageScore.toString()}
              highlight
            />

            <StatCard
              title="Problems Completed"
              value={completedProblems.toString()}
            />
          </section>

          {/* Attempts */}
          <section className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Recent Attempts
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest submissions appear first.
                </p>
              </div>

              <Link
                href="/"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900"
              >
                Practice a Problem
              </Link>
            </div>

            {attempts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="mt-5 space-y-4">
                {attempts.map((attempt) => (
                  <AttemptCard
                    key={attempt.id}
                    attempt={attempt}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{title}</p>

      <p
        className={`mt-2 text-3xl font-bold ${
          highlight ? "text-blue-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function AttemptCard({
  attempt,
}: {
  attempt: Attempt;
}) {
  const score = attempt.score;

  const date = new Date(attempt.createdAt);

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusCompleted = attempt.status === "COMPLETED";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Attempt information */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold">
              {attempt.problem.title}
            </h3>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
              {attempt.problem.difficulty}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs ${
                statusCompleted
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {attempt.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Submitted {formattedDate} at {formattedTime}
          </p>

          {attempt.evaluation?.summary ? (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              {attempt.evaluation.summary}
            </p>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Evaluation is not available yet.
            </p>
          )}
        </div>

        {/* Score + Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[70px] text-center">
            <p className="text-3xl font-bold text-blue-400">
              {score ?? "—"}
            </p>

            <p className="text-xs text-slate-500">
              {score !== null ? "/ 100" : "Score"}
            </p>
          </div>

          {statusCompleted && (
            <Link
              href={`/feedback/${attempt.id}`}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Review
            </Link>
          )}

          <Link
            href={`/practice/${attempt.problemId}`}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold transition hover:bg-blue-600"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
      <div className="text-4xl">📝</div>

      <h3 className="mt-4 text-xl font-semibold">
        No attempts yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Start your first LLD problem and your submissions will
        appear here.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-xl bg-blue-500 px-5 py-3 font-semibold hover:bg-blue-600"
      >
        Start Practicing →
      </Link>
    </div>
  );
}