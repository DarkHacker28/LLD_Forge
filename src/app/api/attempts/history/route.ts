import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const attempts = await prisma.attempt.findMany({
      include: {
        problem: true,
        evaluation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("Failed to fetch attempt history:", error);

    return NextResponse.json(
      { error: "Failed to fetch attempt history." },
      { status: 500 }
    );
  }
}