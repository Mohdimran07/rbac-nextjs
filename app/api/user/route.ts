import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { Prisma } from "@/src/generated/client";
import { Role } from "@/app/types";
import { prisma } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorize to access user information.",
        },
        {
          status: 401,
        },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get("teamId");
    const role = searchParams.get("role");

    const where: Prisma.UserWhereInput = {};

    if (user.role === Role.ADMIN) {
    } else if (user.role === Role.MANAGER) {
      where.OR = [{ teamId: user.teamId }, { role: Role.USER }];
    } else {
      ((where.teamId = user.teamId), (where.role = { not: Role.ADMIN }));
    }

    // Filters
    if (teamId) {
      where.teamId = teamId;
    }
    if (role) {
      where.role = role;
    }
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);

    return NextResponse.json(
      {
        error: "Internal Server Error!",
      },
      { status: 500 },
    );
  }
}
