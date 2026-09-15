"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Attempt = {
  id: string;
  problemId: string;
  code: string;
  explanation: string;
  tradeoffs: string;
  status: string;
  score: number | null;
  problem: {
    title: string;
    difficulty: string;
  };
};

type Evaluation = {
  architectureScore: number;
  solidScore: number;
  extensibilityScore: number;
  requirementsScore: number;
  codeQualityScore: number;
  overallScore: number;
  summary: string;
  strengths: string;
  improvements: string;
};

const scoreDescriptions: Record<string, string> = {
  Architecture:
    "Class structure, responsibilities and relationships between objects.",
  SOLID:
    "Separation of responsibilities, abstraction and maintainability.",
  Extensibility:
    "Ability to support future requirements without major redesign.",
  Requirements:
    "Coverage of the functional requirements given in the problem.",
  "Code Quality":
    "Clarity, object-oriented structure and implementation quality.",
};

export default function FeedbackPage() {
  const params = useParams();
  const id = params.id as string;

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");

  async function loadFeedback() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/attempts/${id}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load attempt.");
      }

      setAttempt(data);

      setEvaluating(true);

      const evaluationResponse = await fetch(
        `/api/attempts/${id}/evaluate`,
        {
          method: "POST",
          cache: "no-store",
        }
      );

      const evaluationData = await evaluationResponse.json();

      if (!evaluationResponse.ok) {
        throw new Error(
          evaluationData.error || "Evaluation failed."
        );
      }

      setEvaluation(evaluationData);
    } catch (err) {
      console.error("Feedback error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load feedback."
      );
    } finally {
      setEvaluating(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadFeedback();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="w-full max-w-md px-6 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <h1 className="mt-6 text-2xl font-bold">
            Loading Your Evaluation
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            We are reviewing your LLD submission and preparing
            actionable feedback.
          </p>
        </div>
      </main>
    );
  }

  if (error || !attempt || !evaluation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="w-full max-w-md px-6 text-center">
          <div className="text-5xl">⚠️</div>

          <h1 className="mt-5 text-2xl font-bold">
            Evaluation Failed
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {error || "Unable to load your evaluation."}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={loadFeedback}
              className="rounded-xl bg-blue-500 px-5 py-3 font-semibold hover:bg-blue-600"
            >
              Try Again
            </button>

            <Link
              href="/"
              className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 hover:bg-slate-900"
            >
              Problems
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const strengths = evaluation.strengths
    .split("\n")
    .filter(Boolean);

  const improvements = evaluation.improvements
    .split("\n")
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold">
            LLD<span className="text-blue-400">Forge</span>
          </Link>

          <Link
            href="/history"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            View History →
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-bold">
            Evaluation Feedback
          </h1>

          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
            {attempt.problem.difficulty}
          </span>

          <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-300">
            {evaluating ? "Evaluating" : "Completed"}
          </span>
        </div>

        <p className="mt-3 text-slate-400">
          {attempt.problem.title}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          Submission ID: {attempt.id}
        </p>
      </section>

      {/* Overall Score */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">
                Overall Score
              </p>

              <div className="mt-2 text-6xl font-bold text-blue-400">
                {evaluation.overallScore}
                <span className="text-2xl text-slate-500">
                  /100
                </span>
              </div>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                {evaluation.summary}
              </p>
            </div>

            <ScoreLabel score={evaluation.overallScore} />
          </div>
        </div>
      </section>

      {/* Score Breakdown */}
      <section className="mx-auto max-w-7xl px-6">
        <div>
          <h2 className="text-2xl font-bold">
            Score Breakdown
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            See exactly which areas of your design need attention.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <ScoreCard
            title="Architecture"
            score={evaluation.architectureScore}
          />

          <ScoreCard
            title="SOLID"
            score={evaluation.solidScore}
          />

          <ScoreCard
            title="Extensibility"
            score={evaluation.extensibilityScore}
          />

          <ScoreCard
            title="Requirements"
            score={evaluation.requirementsScore}
          />

          <ScoreCard
            title="Code Quality"
            score={evaluation.codeQualityScore}
          />
        </div>
      </section>

      {/* Feedback */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-2">
        <FeedbackList
          title="✓ What You Did Well"
          items={strengths}
          emptyMessage="No major strengths were identified yet."
        />

        <FeedbackList
          title="⚡ What You Should Improve"
          items={improvements}
          emptyMessage="No additional improvements were identified."
        />
      </section>

      {/* Learning Guidance */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
          <h2 className="text-xl font-semibold text-blue-300">
            How to improve your next attempt
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <GuidanceCard
              number="1"
              title="Model the domain"
              text="Identify the main entities, responsibilities and relationships before writing implementation code."
            />

            <GuidanceCard
              number="2"
              title="Separate behaviour"
              text="Use interfaces and composition when behaviour is likely to change, such as pricing or allocation strategies."
            />

            <GuidanceCard
              number="3"
              title="Explain trade-offs"
              text="A strong LLD answer explains not only what you designed, but why you chose that design."
            />
          </div>
        </div>
      </section>

      {/* Submitted Design */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Your Submitted Design
          </h2>

          <h3 className="mt-6 text-sm font-medium text-slate-400">
            Code
          </h3>

          <pre className="mt-2 max-h-[500px] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-300">
            {attempt.code}
          </pre>

          <h3 className="mt-6 text-sm font-medium text-slate-400">
            Design Explanation
          </h3>

          <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-950 p-5 text-sm leading-6 text-slate-300">
            {attempt.explanation}
          </p>

          <h3 className="mt-6 text-sm font-medium text-slate-400">
            Trade-offs
          </h3>

          <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-950 p-5 text-sm leading-6 text-slate-300">
            {attempt.tradeoffs || "No trade-offs provided."}
          </p>
        </div>
      </section>

      {/* Actions */}
      <section className="mx-auto flex max-w-7xl flex-wrap gap-4 px-6 pb-12">
        <Link
          href={`/practice/${attempt.problemId}`}
          className="rounded-xl bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-600"
        >
          Try Again →
        </Link>

        <Link
          href="/history"
          className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-900"
        >
          View History
        </Link>

        <Link
          href="/"
          className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-900"
        >
          Browse Problems
        </Link>
      </section>
    </main>
  );
}

function ScoreCard({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>

        <span className="text-xl font-bold text-blue-400">
          {score}
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{
            width: `${Math.max(0, Math.min(score, 100))}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {scoreDescriptions[title]}
      </p>
    </div>
  );
}

function FeedbackList({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: string[];
  emptyMessage: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="mt-5 space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-slate-950 p-4 text-sm leading-6 text-slate-300"
            >
              {item}
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-slate-950 p-4 text-sm text-slate-500">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}

function GuidanceCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-400">
        {number}
      </div>

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function ScoreLabel({ score }: { score: number }) {
  let label = "Needs Improvement";

  if (score >= 85) {
    label = "Excellent";
  } else if (score >= 70) {
    label = "Good";
  } else if (score >= 50) {
    label = "Fair";
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 px-8 py-6 text-center">
      <p className="text-sm text-slate-500">Assessment</p>

      <p className="mt-2 text-xl font-bold text-slate-200">
        {label}
      </p>
    </div>
  );
}