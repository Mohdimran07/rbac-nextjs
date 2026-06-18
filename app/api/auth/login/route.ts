import { generateToken, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill all the details.",
        },
        {
          status: 400,
        },
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { email },
      include: { team: true },
    });

    if (!userExist) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        },
      );
    }

    const isMatchedPassword = verifyPassword(password, userExist.password);

    if (!isMatchedPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 400,
        },
      );
    }

    const token = generateToken(userExist.id);

    const response = NextResponse.json({
      success: true,
      user: userExist,
      token,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error!",
      },
      { status: 500 },
    );
  }
}
