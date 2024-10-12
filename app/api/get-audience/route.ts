import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@clerk/nextjs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const audience = await prisma.audiences.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(audience);
  } catch (error) {
    console.error("[GET_AUDIENCE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}