import Link from "next/link";
import { prisma } from "@/lib/prisma";

const icons: Record<string, string> = {
  "parking-lot": "🚗",
  elevator: "🛗",
  "vending-machine": "🥤",
};

export default async function Home() {
  const problems = await prisma.problem.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold">
            LLD<span className="text-blue-400">Forge</span>
          </Link>

          <div className="flex gap-6 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              Problems
            </Link>

            <Link href="/history" className="hover:text-white">
              My Attempts
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Practice • Design • Improve
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Master Low-Level Design
            <span className="block text-blue-400">
              through practice.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Practice real-world LLD problems, submit your design, and receive
            explainable feedback to improve your next attempt.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#problems"
              className="rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
            >
              Start Practicing →
            </a>

            <Link
              href="/history"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-900"
            >
              View Attempts
            </Link>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section
        id="problems"
        className="mx-auto max-w-6xl px-6 pb-20"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Practice Problems</h2>
          <p className="mt-2 text-slate-400">
            Choose a problem and start designing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <div className="text-4xl">
                  {icons[problem.id] ?? "📐"}
                </div>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {problem.difficulty}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                {problem.title}
              </h3>

              <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">
                {problem.description}
              </p>

              <Link
                href={`/problems/${problem.id}`}
                className="mt-6 block rounded-lg bg-slate-800 px-4 py-3 text-center text-sm font-semibold transition group-hover:bg-blue-500"
              >
                Practice Problem →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold">
            Your Practice Loop
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {[
              ["01", "Choose", "Pick an LLD problem"],
              ["02", "Design", "Write your solution"],
              ["03", "Submit", "Submit your attempt"],
              ["04", "Review", "Get useful feedback"],
              ["05", "Improve", "Try again and improve"],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5"
              >
                <span className="text-sm text-blue-400">{number}</span>

                <h3 className="mt-3 font-semibold">{title}</h3>

                <p className="mt-2 text-sm text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}