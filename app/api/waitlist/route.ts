import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.waitlistSignup.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "You're already on the waitlist" },
        { status: 200 }
      );
    }

    await prisma.waitlistSignup.create({
      data: {
        email,
        firstName: name || "",
        lastName: "",
        contactNumber: "",
        teamSize: "1-5",
        useCase: "Other",
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist. Please try again." },
      { status: 500 }
    );
  }
}
