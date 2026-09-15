import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateSubmission } from "@/lib/evaluator";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const attempt = await prisma.attempt.findUnique({
      where: { id },
      include: { problem: true },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found." },
        { status: 404 }
      );
    }

    const result = evaluateSubmission(
      attempt.problem.slug,
      attempt.code,
      attempt.explanation,
      attempt.tradeoffs
    );

    const evaluation = await prisma.evaluation.upsert({
      where: {
        attemptId: attempt.id,
      },
      update: {
        architectureScore: result.architectureScore,
        solidScore: result.solidScore,
        extensibilityScore: result.extensibilityScore,
        requirementsScore: result.requirementsScore,
        codeQualityScore: result.codeQualityScore,
        overallScore: result.overallScore,
        summary: result.summary,
        strengths: result.strengths.join("\n"),
        improvements: result.improvements.join("\n"),
      },
      create: {
        attemptId: attempt.id,
        architectureScore: result.architectureScore,
        solidScore: result.solidScore,
        extensibilityScore: result.extensibilityScore,
        requirementsScore: result.requirementsScore,
        codeQualityScore: result.codeQualityScore,
        overallScore: result.overallScore,
        summary: result.summary,
        strengths: result.strengths.join("\n"),
        improvements: result.improvements.join("\n"),
      },
    });

    await prisma.attempt.update({
      where: {
        id: attempt.id,
      },
      data: {
        status: "COMPLETED",
        score: result.overallScore,
      },
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Failed to evaluate attempt:", error);

    return NextResponse.json(
      { error: "Failed to evaluate attempt." },
      { status: 500 }
    );
  }
}