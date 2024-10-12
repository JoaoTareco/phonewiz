import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = searchParams.get('count');

  if (!count) {
    return NextResponse.json({ error: 'Video count is required' }, { status: 400 });
  }

  const videoCount = parseInt(count, 10);

  try {
    // Query the database for templates matching the video count
    const templates = await prisma.video_templates.findMany({
      where: {
        num_videos: videoCount
      }
    });

    if (!templates || templates.length === 0) {
      return NextResponse.json({ error: 'No templates found for the given video count' }, { status: 404 });
    }


    // Select a random template from the results
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Parse the JSON stored in videoSequences
    const videoSequences = randomTemplate.videoSequences;

    // Construct the response in the format expected by the frontend
    const template = {
      label: videoSequences.label,
      value: videoSequences.value,
      track_url: randomTemplate.track_url,
      description: videoSequences.description,
      sequences: videoSequences.sequences
    };

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error fetching video template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}