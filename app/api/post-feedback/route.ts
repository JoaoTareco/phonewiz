import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    if (!body) {
      return new NextResponse("Form Values are required", { status: 400 });
    }


    await prismadb.feedback.create({
      data: {
        user_id: userId,
        feedback: body.feedback,
      },
    })

    return NextResponse.json('success');
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
