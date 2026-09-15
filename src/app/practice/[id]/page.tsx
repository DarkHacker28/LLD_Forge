"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Problem = {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  requirements: string;
};

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loadingProblem, setLoadingProblem] = useState(true);

  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [tradeoffs, setTradeoffs] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProblem() {
      try {
        setLoadingProblem(true);

        const response = await fetch("/api/problems");

        if (!response.ok) {
          throw new Error("Failed to load problems");
        }

        const problems: Problem[] = await response.json();

        const selectedProblem = problems.find(
          (problem) => problem.id === id || problem.slug === id
        );

        if (!selectedProblem) {
          throw new Error("Problem not found");
        }

        setProblem(selectedProblem);
      } catch (error) {
        console.error("Failed to load problem:", error);
        setProblem(null);
      } finally {
        setLoadingProblem(false);
      }
    }

    if (id) {
      loadProblem();
    }
  }, [id]);

  async function handleSubmit() {
    setError("");

    if (!code.trim()) {
      setError("Please provide your code/design before submitting.");
      return;
    }

    if (code.trim().length < 100) {
      setError(
        "Your code/design is too short. Add meaningful classes, interfaces and methods."
      );
      return;
    }

    if (!explanation.trim()) {
      setError("Please explain your design before submitting.");
      return;
    }

    if (explanation.trim().length < 50) {
      setError(
        "Please provide a more detailed design explanation (at least 50 characters)."
      );
      return;
    }

    if (!tradeoffs.trim()) {
      setError("Please describe at least one design trade-off.");
      return;
    }

    if (tradeoffs.trim().length < 30) {
      setError(
        "Please provide a more meaningful trade-off explanation (at least 30 characters)."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId: problem!.id,
          code,
          explanation,
          tradeoffs,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit.");
      }

      router.push(`/feedback/${data.id}`);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit your design. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingProblem) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="mt-4 text-slate-400">
            Loading problem...
          </p>
        </div>
      </main>
    );
  }

  if (!problem) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Problem Not Found
          </h1>

          <p className="mt-3 text-slate-400">
            The requested LLD problem could not be found.
          </p>

          <Link
            href="/"
            className="mt-5 inline-block text-blue-400 hover:text-blue-300"
          >
            ← Back to Problems
          </Link>
        </div>
      </main>
    );
  }

  const requirements = problem.requirements
    .split(".")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold"
          >
            LLD<span className="text-blue-400">Forge</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← All Problems
          </Link>
        </div>
      </nav>

      {/* Problem Header */}
      <section className="mx-auto max-w-7xl px-6 pt-10">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-4xl font-bold">
            {problem.title}
          </h1>

          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
            {problem.difficulty}
          </span>
        </div>

        <p className="mt-4 max-w-3xl text-slate-400">
          {problem.description}
        </p>
      </section>

      {/* Main Practice Area */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-3">
        {/* Requirements */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Requirements
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Make sure your design addresses these requirements.
          </p>

          <div className="mt-6 space-y-4">
            {requirements.map((requirement, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-lg bg-slate-950 p-4"
              >
                <span className="font-semibold text-blue-400">
                  {index + 1}
                </span>

                <span className="text-sm leading-6 text-slate-300">
                  {requirement}.
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <h3 className="font-semibold text-blue-300">
              💡 What to focus on
            </h3>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
              <li>• Classes and interfaces</li>
              <li>• Clear responsibilities</li>
              <li>• Relationships between objects</li>
              <li>• SOLID principles</li>
              <li>• Extensibility and future changes</li>
              <li>• Design trade-offs</li>
            </ul>
          </div>
        </div>

        {/* Code */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Your Design
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Write your classes, interfaces and core implementation.
              </p>
            </div>

            <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
              {code.length} chars
            </span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Example:

interface Vehicle {
  getType(): VehicleType;
}

interface ParkingStrategy {
  findSpot(vehicle: Vehicle): ParkingSpot | null;
}

class ParkingLot {
  private floors: ParkingFloor[];

  parkVehicle(vehicle: Vehicle) {
    // your implementation
  }

  exitVehicle(ticketId: string) {
    // calculate fee
  }
}`}
            className="mt-5 h-[500px] w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>
              {code.trim().length < 100
                ? "Add more implementation details"
                : "✓ Good amount of code"}
            </span>

            <span>
              Minimum: 100 characters
            </span>
          </div>
        </div>

        {/* Explanation */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Explain Your Design
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Help the evaluator understand your decisions.
          </p>

          <label className="mt-6 block text-sm font-medium text-slate-300">
            Design Explanation
          </label>

          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain the main classes, their responsibilities, relationships, and how the system works..."
            className="mt-2 h-48 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <div className="mt-2 text-right text-xs text-slate-500">
            {explanation.length} characters
          </div>

          <label className="mt-6 block text-sm font-medium text-slate-300">
            Trade-offs
          </label>

          <textarea
            value={tradeoffs}
            onChange={(e) => setTradeoffs(e.target.value)}
            placeholder="What design trade-offs did you make? What alternative could you use? What would you improve later?"
            className="mt-2 h-40 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <div className="mt-2 text-right text-xs text-slate-500">
            {tradeoffs.length} characters
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-300">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-blue-500 px-5 py-3 font-semibold transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : "Submit Design →"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-500">
            Your submission will be evaluated against the problem requirements.
          </p>
        </div>
      </section>
    </main>
  );
}