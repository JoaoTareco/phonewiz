import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
// import Configuration from "openai"
import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit } from "@/lib/api-limit";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // if (!configuration.apiKey) {
    //   return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    // }

    if (!body) {
      return new NextResponse("Form Values are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    console.log(body.target_audience)
    console.log(body.video_topic)
    console.log(body.hook)

   const prompt=[
      {role: "system", content: "You are a viral content expert."},
      {role: "user", content: `I need your help to generate a caption for an instagram reel.

      Make the copywritting impeccable and memorable, while being straightforward and like spoken language. Don't overly use adjectives. I want the caption to be very informative and have actionable value for who will read it.
      
      Create me a video caption that targets the ${body.target_audience} audience about the topic "${body.video_topic}". 
      The hook that will appear as text in the video is this: "${body.hook}".
      Here is an example of a caption so you understand the structure and language type I want (disregard the content itself of the example, 
        as it may have nothing to do with the target audience and topic of the new caption I am asking you to write):

      "↓ HERE’S how to actually grow on Instagram

      Read & save this for later ⬇️ 💾
      
      Instagram doesn’t really care if you post daily or, let’s say, 4 times per week. Some creators consistently grow their audience by posting 3-5 times per week, while others post 1-2 times per day and NEVER grow.
      
      Why is that? 🤔
      
      Okay, HERE are the 3 things:
      
      1️⃣ Great ideas - To simplify, focus on the first 3 seconds of your reel. Make sure your visuals and hook instantly grab attention. Spend 80% of your time on the first seconds of the video, as this matters the most.
      
      2️⃣ Watch-time - This is the most important metric. Maximize it by creating shorter reels, 5-7 seconds long. Aim to consistently hit 90% watch time on these short videos.
      
      3️⃣ Trends - This comes last after the first two but is also crucial. Follow trends and find ways to incorporate them within your niche. Trends could include hooks, audios, and content ideas.
      
      ⚡️ If you can consistently combine these elements mentioned above in each of your new reels, you will eventually go viral. It doesn’t matter if you’re posting daily or just 4 times per week.
      
      🤫 This is exactly what I teach inside the Viral Reels Secrets program.
      
      🧠 It also includes full content research and editing tutorials, where I show you how I come up with great ideas for my reels and edit them!
    
      .
      .
      .
      #reels
      #reelsinstagram
      #reelshacks
      
      
      `}
    ]


    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt as any
    });

    const contentWithLineBreaks = response.choices[0].message.content?.slice(1, -1);

    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    return NextResponse.json(contentWithLineBreaks);
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
