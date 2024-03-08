import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit } from "@/lib/api-limit";
import prismadb from "@/lib/prismadb";

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

    // Check if the user already has a content plan
    const existingPlan = await prismadb.content_plans.findFirst({
      where: { user_id: userId, innactive: false },
    });

    if (existingPlan && body.re_generate === false) {
      // Return existing plan if found
      const response = {
        content_plan: existingPlan.content_plan,
        niche: existingPlan.niche
      };
      return NextResponse.json(response);
    }

    if (body.first_time === true) {
      return NextResponse.json([]);
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
      {
        "role": "system",
        "content": "You are a viral intagram content expert."
      },
      {
        "role": "user",
        "content": "Create me a content plan for posting instagram reels with the purpose of gaining more followers.   "
      },
      {
        "role": "assistant",
        "content": "How would you describe your niche/ideal audience?"
      },
      {
        "role": "user",
        "content": body.niche
      },
      {
        "role": "assistant",
        "content": "What are some common struggles or questions of your ideal audience?"
      },
      {
        "role": "user",
        "content": body.struggles
      },
      {
        "role": "assistant",
        "content": "What are some mistakes they usually make?"
      },
      {
        "role": "user",
        "content": body.mistakes
      },
      {
        "role": "assistant",
        "content": "What kind of social proof do they need to see?"
      },
      {
        "role": "user",
        "content": body.social_proof
      },
      {
        "role": "assistant",
        "content": "How should the plan be generated?"
      },
      {
        "role": "user",
        "content": "You need to generate a post per day for the next 4 weeks. For each post, you need to set the topic of the reel, the type of post (either \"Read Caption\", \"Bullet List\" or \"How To\") and the Call to Action (either \"Follow for more\", \"Comment for free guide\", \"Link in Bio\"). The topics should be engaging and make people intrigued and want to watch the video.\n\nGive me the content plan in an array, with an entry per week (monday to sunday),  for the full 4 weeks. Here is an example format of a single week (so I want this, times 4):\n[[{\n      weekDay: \"Monday\",\n      topic: \"How to drive sales with Instagram Stories\",\n      type: \"Read Caption\",\n      cta: \"Follow\",\n    },\netc...],\n[{\n      weekDay: \"Monday\",\n      topic: \"How I made 100k on instagram,\n      type: \"Read Caption\",\n      cta: \"Comment for free guide\",\n    },\netc...],\netc... until there are 4 weeks]\n\nI will take directly your response and parse it as a JSON, so DON'T write anything besides the correctly formated JSON. Remember JSON requires that property names (keys) be enclosed in double quotes This is critical."
      },
    ]


    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt as any,
      temperature: 0.5,
      max_tokens: 4095,
    });

    const contentWithLineBreaks = response.choices[0].message.content;

    console.log(contentWithLineBreaks)

    const cleanedString = contentWithLineBreaks?.replace(/\r?\n|\r/g, "") || "";

    console.log(cleanedString)

    const jsonObject = JSON.parse(cleanedString);


    // Update existing content plans to be inactive
    await prismadb.content_plans.updateMany({
      where: { user_id: userId },
      data: { innactive: true },
    });


     // Insert new content plan and set existing ones as inactive
    await prismadb.content_plans.create({
      data: {
        content_plan: jsonObject,
        niche: body.niche,
        struggles: body.struggles,
        mistakes: body.mistakes,
        social_proof: body.social_proof,
        user_id: userId,
        innactive: false,
      },
    });

    console.log(jsonObject)

    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    return NextResponse.json(jsonObject);
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
