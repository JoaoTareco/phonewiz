import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { PrismaClient } from '@prisma/client';
import axios from "axios";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
    
        if (!userId) {
          return new NextResponse("Unauthorized", { status: 401 });
        }
    
        const { topic, hook, objective, cta } = body; // Expecting topic and hook in the request body
    
        // Fetch videos from Supabase object storage
        const result = await prisma.$queryRawUnsafe(`SELECT name FROM storage.objects WHERE name LIKE '${userId}/%'`);
        const typedResult = result as { name: string }[];
    
        let allVideos: string[] = typedResult.map(asset => `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/content-bank/${asset.name}`);
        let selectedVideos: string[] = [];
    
        // Check if there are videos in Supabase
        if (allVideos.length > 0) {
          selectedVideos = allVideos.sort(() => 0.5 - Math.random()).slice(0, 2);
        } else {
          // Prepare a prompt to get search queries for the topic
          const prompt = [
            { "role": "system", "content": "You are a viral content expert." },
            {
              "role": "user",
              "content": `Given the topic: "${topic}", provide a search query to fetch related video content from Pexels. The search query should be max 2 words. Answer in JSON format with the topic as the key and the search query as the value.`
            }
          ];
    
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: prompt as any
          });
    
          // Extract search query from the response content
          const searchQueriesContent = response.choices[0].message.content;
          const cleanedContent = searchQueriesContent?.replace('```json', '').replace('```', '');
          const searchQueries = cleanedContent ? JSON.parse(cleanedContent) : {};
          console.log(searchQueries);
    
          // Fetch videos from Pexels using the search query
          const query = searchQueries[topic];
          if (query) {
            const libraryVideos = await axios.get(`https://api.pexels.com/videos/search?query=${query}&per_page=5&orientation=portrait&size=small&page=1`, {
              headers: {
                'Authorization': process.env.PEXELS_API_KEY
              }
            });
    
            const videoLinks = libraryVideos.data.videos.map(video => video.video_files[0].link);
            selectedVideos = videoLinks.sort(() => Math.random() - 0.5).slice(0, 2); // Get two random videos
          }
        }
    
        const finalResponse = {
          textSequences: [
            {
              id: 'title',
              type: 'text',
              content: hook,
              start: 0,
              duration: 90 / 30,
              x: 0,
              y: 0,
              font: 'default',
              color: 'default',
              backgroundColor: 'default',
            },
            {
              id: 'readCap',
              type: 'text',
              content: 'Read Caption',
              start: 90 / 30,
              duration: 90 / 30,
              x: 0,
              y: 0,
              font: 'default',
              color: 'default',
              backgroundColor: 'default',
            },
          ],
          videoSequences: selectedVideos.map((vid, index) => ({
            video: vid,
            startFrame: index * 90,
            durationInFrames: 90,
          })),
          topic,
          hook,
          cta: cta,
          objective: objective,
        };
    
        await prisma.generated_posts.create({
          data: {
            userId: userId,
            topic: topic,
            hook: hook,
            cta: cta,
            objective: objective,
            videos: JSON.stringify(finalResponse.videoSequences),
            texts: JSON.stringify(finalResponse.textSequences)
          }
        });
    
        return NextResponse.json(finalResponse);
  } catch (error) {
    console.log('[GENERATE_VIDEO_CONTENT_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};