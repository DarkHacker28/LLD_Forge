// src/app/api/attempts/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
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

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("Failed to fetch attempt:", error);

    return NextResponse.json(
      { error: "Failed to fetch attempt." },
      { status: 500 }
    );
  }
}