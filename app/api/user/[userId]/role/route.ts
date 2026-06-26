import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/src/generated/enums";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;

    const currUser = await getCurrentUser();

    if (!currUser || !checkUserPermission(currUser, Role.ADMIN)) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to assign role!",
        },
        { status: 401 },
      );
    }

    if (currUser.id === userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot change your own role.",
        },
        { status: 401 },
      );
    }

    const { role } = await request.json();

    const validateRoles = [Role.USER, Role.MANAGER];

    if (!validateRoles.includes(role)) {
      return NextResponse.json(
        {
          error: "Invalid role or you can't have more than one admin role",
        },
        { status: 404 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      include: { team: true },
    });

    return NextResponse.json(
      {
        success: true,
        user: updatedUser,
        message: `User role updated to ${role} successfully`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Role assignment error: ", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
