import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query'],
});

const project_id = process.env.SUPABASE_PROJECT_ID;

export async function GET(
  req: Request
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await prisma.$queryRawUnsafe(`SELECT name FROM storage.objects where name like '${userId}/%'`)

    // Assert the type of result
    const typedResult = result as { name: string }[];

    let all_videos: any = []

    // Use typedResult instead of result
    typedResult.forEach((asset) => {
      all_videos.push(`https://${project_id}.supabase.co/storage/v1/object/public/content-bank/${asset.name}`)
    });

    const url = new URL(req.url)
    const videoCount = Number(url.searchParams.get('videoCount'))

    let selected_videos : any = []

    for (let i = 0; i < all_videos.length; i++) {
      const randomIndex = Math.floor(Math.random() * all_videos.length); // Generate a random index
      const randomVideo = all_videos[randomIndex]; // Access the video at the random indexn
      selected_videos.push(randomVideo);
    }

    const final_response = {
      all_videos: all_videos,
      selected_videos: selected_videos
    }
    
    return NextResponse.json(final_response);
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
