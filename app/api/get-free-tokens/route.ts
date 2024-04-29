import { MAX_FREE_COUNTS } from "@/constants";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(
  req: Request
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userApiLimit = await prismadb.userApiLimit.findUnique({
      where: { userId: userId },
    })

    if (!userApiLimit) {
      await prismadb.userApiLimit.create({
        data: {
          userId: userId,
          count: MAX_FREE_COUNTS
        }
      })
    }

    return NextResponse.json('done');
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
