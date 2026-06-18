import { generateToken, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/src/generated/enums";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, teamCode } = await request.json();


    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        {
          status: 400,
        },
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userExists) {
      return NextResponse.json(
        {
          error: "User with this email address exists",
        },
        { status: 409 },
      );
    }

    let teamId: string | undefined;

    if (teamCode) {
      const team = await prisma.team.findUnique({
        where: { code: teamCode },
      });
      if (!team) {
       return NextResponse.json(
          {
            error: "Please enter a valid team code.",
          },
          { status: 409 },
        );
      }
      teamId = team?.id;
    }

    const hassedPassword = await hashPassword(password);
    //userCount:first user becomes ADMIN
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? Role.ADMIN : Role.USER;


    const newUser = await prisma.user.create({
      data: { name, email, password: hassedPassword, role, teamId },
      include: { team: true },
    });

    // Generate Token:
    const token = generateToken(newUser?.id);

    //  response
    const response = NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        teamId: newUser.teamId,
        team: newUser.team,
        token,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Registration Failed:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error!",
      },
      { status: 500 },
    );
  }
}
