import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    {
      message: "User logged out successfully!",
    },
    {
      status: 200,
    },
  );

  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });

  return response
}
