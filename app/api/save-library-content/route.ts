import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import axios from "axios";


export async function POST(
  req: NextRequest
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log(body.video_urls)

    // Extract search_query from URL
    const video_url = body.video_urls;

    if (!video_url) {
      return new NextResponse("Missing video_url", { status: 400 });
    }

    for (const url of body.video_urls) {
      await prismadb.savedLibraryVideos.create({
        data: {
          url: url,
          userId: userId,
        }
      });
    }

    
    return NextResponse.json(201);
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
