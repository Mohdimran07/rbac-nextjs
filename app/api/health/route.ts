import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$runCommandRaw({ ping: 1 });

    return NextResponse.json(
      {
        status: "ok",
        message: "Database connected successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "disconnected",
        error,
      },
      { status: 500 },
    );
  }
}
