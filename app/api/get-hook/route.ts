import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
// import Configuration from "openai"
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

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

    console.log(body)

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

   const prompt=[
      {"role": "system", "content": "You are a viral content expert."},
      {"role": "user", "content": `I need your help to generate a compelling hook for an instagram reel.
      
      Take inspiration from viral Instagram reels that have more than 1 million views.
      
      Create me a video hook that targets the ${body.target_audience} audience about the topic "${body.video_topic}". 
      
      The hooks should be very short and engaging, and a person should be able to read it out loud in about 2 seconds. There should be no emojis.
      
      Here are some examples of great hooks. Mimic this type of language and writing. Don't use any complicated words. Don't use punctuation. Just very succinct and it should entice curiosity. The topic of these examples may have nothing related to the topic I want now:
      {"hook1": "The secret about affiliate marketing with instagram",
       "hook2": "What I wish I'd known about affiliate marketing with instagram",
       "hook3": "You are doing affiliate marketing wrong",
       "hook4": "Here's why your not making money on instagram",
       "hook5": "The Instagram marketing strategy that drives massive sales",
       "hook6": "One weird trick for affiliate marketing",
       "hook7": "The Instagram marketing loophole",
       "hook8": "What top affiliate marketers don't want you to know",
       "hook9": "The biggest lesson I've learnt about affiliate marketing with Instagram"}
      
      Give me 9 hooks in a JSON format with a key for each hook. Return ONLY the JSON object, no other text.
      `}
    ]

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt
    });

    const contentWithLineBreaks = JSON.parse(response.choices[0].message.content);

    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    return NextResponse.json(contentWithLineBreaks);
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
