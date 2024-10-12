import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@clerk/nextjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const audience = await prisma.audiences.create({
      data: {
        user_id: userId,
        niche: body.niche,
        struggles: body.struggles,
        mistakes: body.mistakes,
        social_proof: body.social_proof
      }
    });

    return NextResponse.json(audience);
  } catch (error) {
    console.error("[DEFINE_AUDIENCE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}