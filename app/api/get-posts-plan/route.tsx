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

    const prompt=[
        {
          "role": "system",
          "content": "You are a viral intagram content expert."
        },
        {
          "role": "user",
          "content": `Create me ${body.num_posts} posts for an instagram Reel with the purpose of gaining more followers.`
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
          "content": "What are some specific topics you would like to cover with your content?"
        },
        {
          "role": "user",
          "content": body.specific_content
        },
        {
            "role": "assistant",
            "content": "How should the topic for the post be generated?"
        },
        {
            "role": "user",
            "content": "The topic should help the Instagram page grow its audience and gain more followers. It should be a topic that is engaging and make people want to watch the video. It should be a topic that is related to the niche and the struggles of the audience. It can deviate from the specific content provided, but it should be related and serve the purpose of growing the audience. The topic should be planned within the objective of the post, which can be Nurture, Awareness or Convertion."
        },
        {
          "role": "assistant",
          "content": "How should the hook for the post be generated?"
        },
        {
            "role": "user",
            "content" : `Take inspiration from viral Instagram reels that have more than 1 million views. The hooks should be very short and engaging, and a person should be able to read it out loud in about 2 seconds. There should be no emojis. Here are some examples of great hooks. Mimic this type of language and writing. Don't use any complicated words. Don't use punctuation. Just very succinct and it should entice curiosity. The topic of these examples may have nothing related to the topic I want now: "The secret about affiliate marketing with instagram", "What top affiliate marketers don't want you to know", "One weird trick for affiliate marketing", "Here's why your not making money on instagram", "The Instagram marketing strategy that drives massive sales", "You are doing affiliate marketing wrong", "What I wish I'd known about affiliate marketing with instagra 3 months ago when I started", "POV: you took action and now you've made 15k in the last 30 days, quit your job and are planning to go on holidays next month", "The biggest lesson I've learnt about affiliate marketing with Instagram"`
        },
        {
            "role": "assistant",
            "content": "How should I generate for this Instagram Reel?"
        },
        {
          "role": "user",
          "content": `For these ${body.num_posts} posts, you need to generate a topic for each reel, the Call to Action (either a variation of \"Follow for more\", \"Comment for free guide\" or \"Link in Bio\"), a hook for the Reel and the objective for the Reel (from Nurture, Awareness or Convertion). The topic and hook should be engaging and make people intrigued and want to watch the video.\n\nGive me the posts in an array with ${body.num_posts} posts, in a JSON format, with the following properties: topic, hook, cta, objective. \n\nTHIS IS VERY IMPORTANT, as I will take directly your response and parse it as a JSON, so DON'T write anything besides the correctly formated JSON. Remember JSON requires that property names (keys) be enclosed in double quotes This is critical.`
        },
      ]

        // Include existing topics in the prompt if provided
      if (body.existing_topics && body.existing_topics.length > 0) {
        prompt.push({
          "role": "user",
          "content": `Avoid generating topics that are similar to these: ${body.existing_topics.join(', ')}. Be creative and think outside the box. Also be creative in the CTA and hook. Choose an objective at random, with Awareness with 40% chance, and Nurture and Convertion with 30% chance each. `
        });
      }
  
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: prompt as any,
        temperature: 0.7,
        top_p: 0.8,
        max_tokens: 1500,
      });

      console.log(response.choices[0].message.content)

      const contentWithLineBreaks = response.choices[0].message.content;
      let jsonResponse;

      try {
        // First, try to parse the content as-is
        jsonResponse = JSON.parse(contentWithLineBreaks);
      } catch (error) {
        // If parsing fails, try to remove the JSON code block markers
        const cleanedContent = contentWithLineBreaks
          .replace(/^```json\n/, '')  // Remove opening ```json
          .replace(/\n```$/, '');     // Remove closing ```

        // Try parsing again with the cleaned content
        jsonResponse = JSON.parse(cleanedContent);
      }

      if (body.num_posts === 1 && body.regenerate_topic) {
        // Fetch the last content plan
        const lastContentPlan = await prisma.content_plans.findFirst({
          where: { user_id: userId },
          orderBy: { created_at: 'desc' },
          select: { content_plan: true }
        });

        if (lastContentPlan) {
          const lastPlan = lastContentPlan.content_plan as any[];
          // Find the index of the post to regenerate
          const indexToRegenerate = lastPlan.findIndex(post => post.topic === body.regenerate_topic);
          
          if (indexToRegenerate !== -1) {
            console.log('here')
            // Replace the post at the found index with the new post
            lastPlan[indexToRegenerate] = jsonResponse[0];
            jsonResponse = lastPlan;
          }
        }
      }

      // Save the generated content plan
      await prisma.content_plans.create({
        data: {
          user_id: userId,
          content_plan: jsonResponse,
          niche: body.niche,
          struggles: body.struggles,
          mistakes: body.mistakes,
          social_proof: body.social_proof
        }
      });
    
      return NextResponse.json(jsonResponse);
  } catch (error) {
    console.log('[GENERATE_POSTS_PLAN_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};