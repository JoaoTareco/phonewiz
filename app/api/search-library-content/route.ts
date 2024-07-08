import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

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

function getLowestQualityVideos(videos: Video[]): { id: number; lowestQualityVideo: VideoFile }[] {
  return videos.map(video => {
    const lowestQualityVideo = video.video_files.reduce((lowest, current) => {
      const lowestResolution = lowest.width * lowest.height;
      const currentResolution = current.width * current.height;

      if (currentResolution < lowestResolution || 
          (currentResolution === lowestResolution && current.size < lowest.size)) {
        return current;
      }
      return lowest;
    });

    return {
      id: video.id,
      lowestQualityVideo
    };
  });
}

export async function GET(
  req: NextRequest
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Extract search_query from URL
    const search_query = req.nextUrl.searchParams.get('search_query');

    const page_query = req.nextUrl.searchParams.get('page');

    if (!search_query) {
      return new NextResponse("Missing search query", { status: 400 });
    } else if (!page_query) {
      return new NextResponse("Missing page query", { status: 400 });
    }

    const response = await axios.get(`https://api.pexels.com/videos/search?query=${search_query}&per_page=200&orientation=portrait&size=small&page=${page_query}`, {
      headers: {
        'Authorization': process.env.PEXELS_API_KEY
      }
    });

    const videos: Video[] = response.data.videos;
    const lowestQualityVideos = getLowestQualityVideos(videos);
    
    // Create the array to return to the frontend
    const videoData = lowestQualityVideos.map(video => ({
      id: video.id,
      url: video.lowestQualityVideo.link
    }));
    
    return NextResponse.json(videoData);
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
