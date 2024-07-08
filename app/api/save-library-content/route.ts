import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

import axios from "axios";

interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number;
  height: number;
  fps: number;
  link: string;
  size: number;
}

interface Video {
  id: number;
  video_files: VideoFile[];
  // other properties...
}

function extractVideoId(url: string): string | null {
  const regex = /\/(\d+)\//;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function getSpecificQualityVideoUrl(video_files: VideoFile[]): string {
  const targetWidth = 1080;
  const targetHeight = 1920;

  // Try to find the video file with the target dimensions
  let targetVideo = video_files.find(file => 
    file.width === targetWidth && file.height === targetHeight
  );

  // If not found, fall back to the highest resolution available
  if (!targetVideo) {
    targetVideo = video_files.reduce((highest, current) => {
      return (current.width * current.height > highest.width * highest.height) ? current : highest;
    });
  }

  return targetVideo ? targetVideo.link : "";
}


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
      const videoId = extractVideoId(url);

      const response = await axios.get(`https://api.pexels.com/videos/videos/${videoId}`, {
        headers: {
          'Authorization': process.env.PEXELS_API_KEY
        }
      });

      const videoUrl = getSpecificQualityVideoUrl(response.data.video_files);

      await prismadb.savedLibraryVideos.create({
        data: {
          url: videoUrl,
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
