import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const problem = await prisma.problem.findUnique({
    where: {
      id,
    },
  });

  if (!problem) {
    notFound();
  }

  const requirements = problem.requirements
    .split(".")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold">
            LLD<span className="text-blue-400">Forge</span>
          </Link>

          <Link
            href="/history"
            className="text-sm text-slate-300 hover:text-white"
          >
            My Attempts
          </Link>
        </div>
      </nav>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to Problems
        </Link>

        <div className="mt-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
              {problem.difficulty}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold md:text-5xl">
            {problem.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            {problem.description}
          </p>
        </div>

        {/* Requirements */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Requirements
          </h2>

          <ul className="mt-5 space-y-4">
            {requirements.map((requirement, index) => (
              <li
                key={index}
                className="flex gap-3 text-slate-300"
              >
                <span className="text-blue-400">✓</span>
                <span>{requirement}.</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What to submit */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            What You Should Submit
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-4">
              <h3 className="font-semibold">Code</h3>
              <p className="mt-2 text-sm text-slate-500">
                Classes, interfaces and core domain logic.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <h3 className="font-semibold">Design Explanation</h3>
              <p className="mt-2 text-sm text-slate-500">
                Explain your responsibilities and relationships.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-4">
              <h3 className="font-semibold">Trade-offs</h3>
              <p className="mt-2 text-sm text-slate-500">
                Explain important decisions and alternatives.
              </p>
            </div>
          </div>
        </div>

        {/* Start */}
        <div className="mt-8">
          <Link
            href={`/practice/${problem.id}`}
            className="inline-block rounded-lg bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-600"
          >
            Start Practice →
          </Link>
        </div>
      </section>
    </main>
  );
}