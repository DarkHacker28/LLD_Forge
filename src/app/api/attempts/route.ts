import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { problemId, code, explanation, tradeoffs } = body;

    if (!problemId || !code || !explanation) {
      return NextResponse.json(
        { error: "Problem, code and explanation are required." },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found." },
        { status: 404 }
      );
    }

    const attempt = await prisma.attempt.create({
      data: {
        problemId,
        code,
        explanation,
        tradeoffs: tradeoffs ?? "",
        status: "SUBMITTED",
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Failed to create attempt:", error);

    return NextResponse.json(
      { error: "Failed to create attempt." },
      { status: 500 }
    );
  }
}