import { getCurrentUser } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized",
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error!",
      },
      { status: 500 },
    );
  }
}
