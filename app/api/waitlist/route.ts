import { NextResponse } from "next/server";
import * as z from "zod";

import { prisma } from "@/lib/prisma";

const waitlistSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  contactNumber: z.string().min(1),
  teamSize: z.string().min(1),
  useCase: z.enum(["Backend", "Frontend", "CloudInfrastructure", "Other"]),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = waitlistSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    try {
      await prisma.waitlistSignup.create({
        data: parsed.data,
      });
    } catch (err) {
      const maybeCode = (err as { code?: string } | undefined)?.code;
      // Prisma unique violation
      if (maybeCode === "P2002") {
        return NextResponse.json(
          { error: "Already joined" },
          { status: 409 },
        );
      }
      throw err;
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit waitlist form" },
      { status: 500 },
    );
  }
}

