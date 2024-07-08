import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

import { PrismaClient } from '@prisma/client'
import axios from "axios";

const prisma = new PrismaClient({
  log: ['query'],
});


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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

const project_id = process.env.SUPABASE_PROJECT_ID;

function getSpecificQualityVideoUrls(videos: Video[]): string[] {
  const targetWidth = 1080;
  const targetHeight = 1920;

  return videos.map(video => {
    // Try to find the video file with the target dimensions
    let targetVideo = video.video_files.find(file => 
      file.width === targetWidth && file.height === targetHeight
    );

    // If not found, fall back to the highest resolution available
    if (!targetVideo) {
      targetVideo = video.video_files.reduce((highest, current) => {
        return (current.width * current.height > highest.width * highest.height) ? current : highest;
      });
    }

    return targetVideo.link;
  });
}


export async function GET(
  req: Request
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await prisma.$queryRawUnsafe(`SELECT name FROM storage.objects where name like '${userId}/%'`)

    const savedLibraryVideos = await prisma.savedLibraryVideos.findMany({
      where: {
        userId: userId
      }
    })

    // Assert the type of result
    const typedResult = result as { name: string }[];

    let all_videos: any = []

    // Use typedResult instead of result
    typedResult.forEach((asset) => {
      all_videos.push(`https://${project_id}.supabase.co/storage/v1/object/public/content-bank/${asset.name}`)
    });

    savedLibraryVideos.forEach((video) => {
      all_videos.push(video.url)
    })

    const url = new URL(req.url)
    const videoCount = Number(url.searchParams.get('videoCount'))
    const video_topic = url.searchParams.get('video_topic')
    const video_source = url.searchParams.get('video_source')

    console.log(video_topic)

    if (video_source === "Library" || (video_source === "Content Bank" && all_videos.length < 2) ) {
      const prompt=[
        {"role": "system", "content": "You are a viral content expert."},
        {"role": "user", "content": `given the video topic "${video_topic}", 
        give me a search query of possible related video content to fetch videos from Pexels that match this topic.
        Answer ONLY with the search query, nothing else, as your response will be used as a direct variable for the query. 
        Don't use special characters as double quotes. The search query should be short.

        Please follow these examples (if you do not follow them, the response will be wrong):
        An example for the topic "How I made 100k on instagram": the output would be "working from phone".
        Another example for the topic "Best brunch in lisbon": the output would be just "lisbon", and NOT "lisbon brunch" or "lisbon" and anything else along with it, like "lisbon food". 
        This is because its a topic deeply related to something specific (the city lisbon), and if you search for "lisbon {+ anything else}" in pexels it might give videos that are not related to lisbon.
        `}
      ]
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: prompt as any
      });
  
      const generated_query = response.choices[0].message.content

      console.log(generated_query)

      const library_videos = await axios.get(`https://api.pexels.com/videos/search?query=${generated_query}&per_page=10&orientation=portrait&size=small&page=1`, {
      headers: {
        'Authorization': process.env.PEXELS_API_KEY
      }
    });

      console.log(library_videos.data.videos[0].video_files)
     
      // Usage:
      const videos: Video[] = library_videos.data.videos;
      const videoUrls = getSpecificQualityVideoUrls(videos);

      const final_response = {
        all_videos: all_videos,
        selected_videos: videoUrls
      }

      return NextResponse.json(final_response);
    }

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
