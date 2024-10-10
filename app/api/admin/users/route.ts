import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    // Fetch all users with their credits
    const users = await prisma.user.findMany({
      select: {
        id: true,
        credits: true,
        // No need to include subscription details as per your requirements
      },
    });

    return NextResponse.json({
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}
