import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
// import Configuration from "openai"
import { checkSubscription } from "@/lib/subscription";
import { checkApiLimit, incrementApiLimit } from "@/lib/api-limit";
import prismadb from "@/lib/prismadb";

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

   const promptBullet=[
      {role: "system", content: "You are a viral content expert."},
      {role: "user", content: `I need your help to generate a caption for an instagram reel.

      Make the copywritting impeccable and memorable, while being straightforward and like spoken language. Don't overly use adjectives. I want the caption to be very informative and have actionable value for who will read it.
      
      Create me a video caption that targets the Instagram creator audience about the topic "How to grow on instagram". The caption should have a short bullet list.
      The hook that will appear as text in the video is this: "How to actually grow on Instagram".
      Also re-write these personal insights into the caption: "Its important to have good video ideas. To focus on the first 3 seconds of your reels. Maximizing watch time by creating short reels. less important but also is the importance of following trends.".
      In the end, include also a call to action in the form of "This is exactly what I teach inside the Viral Reels Secrets program, comment "link" and I'll send it to you. It also includes full content research and editing tutorials, where I show you how I come up with great ideas for my reels and edit them!".
      Don't write anything else besides the output caption.
      `
      },
      {
        "role": "assistant",
        "content": `↓ HERE’S how to actually grow on Instagram

Read & save this for later ⬇️ 💾
        
Instagram doesn’t really care if you post daily or, let’s say, 4 times per week. Some creators consistently grow their audience by posting 3-5 times per week, while others post 1-2 times per day and NEVER grow.
        
Why is that? 🤔
        
Okay, HERE are the 3 things:
        
1️⃣ Great ideas - To simplify, focus on the first 3 seconds of your reel. Make sure your visuals and hook instantly grab attention. Spend 80% of your time on the first seconds of the video, as this matters the most.
        
2️⃣ Watch-time - This is the most important metric. Maximize it by creating shorter reels, 5-7 seconds long. Aim to consistently hit 90% watch time on these short videos.
        
3️⃣ Trends - This comes last after the first two but is also crucial. Follow trends and find ways to incorporate them within your niche. Trends could include hooks, audios, and content ideas.
        
⚡️ If you can consistently combine these elements mentioned above in each of your new reels, you will eventually go viral. It doesn’t matter if you’re posting daily or just 4 times per week.
        
🤫 This is exactly what I teach inside the Viral Reels Secrets program, comment "link" and I'll send it to you.
        
It also includes full content research and editing tutorials, where I show you how I come up with great ideas for my reels and edit them!
      
.
.
.
#reels
#reelsinstagram
#reelshacks`
      },
      {role: "user", content: `I need your help to generate another caption for an instagram reel.

      Make the copywritting impeccable and memorable, while being straightforward and like spoken language. Don't overly use adjectives. I want the caption to be very informative and have actionable value for who will read it.
      
      Create me a video caption that targets the ${body.target_audience} audience about the topic "${body.video_topic}". The caption should have a short bullet list.
      The hook that will appear as text in the video is this: "${body.hook}".
      Also re-write these personal insights into the caption: "${body.personal_insights}".
      In the end, include also a call to action in the form of "${body.call_to_action}".
      Don't write anything else besides the output caption.
      `}
    ]

    const promptHowTo=[
      {role: "system", content: "You are a viral content expert."},
      {role: "user", content: `I need your help to generate a caption for an instagram reel.

      Make the copywritting impeccable and memorable, while being straightforward and like spoken language. Don't overly use adjectives. I want the caption to be very informative and have actionable value for who will read it.
      
      Create me a video caption that targets the Faceless Instagram creators that want to make money with digital producs audience about the topic "How to make money on instagram". The caption should be like a "How To" for the topic.
      The hook that will appear as text in the video is this: "If I had to start over, here's what I would do".
      Also re-write these personal insights into the caption: "Focus on providing value. Post 3 reels a day and 10 stories. Create digital products that solve a problem or use Done for you products".
      In the end, include also a call to action in the form of "If you want a digital marketing, lower price point, comment Digital, and I'll send you the link!".
      Don't write anything else besides the output caption.
      `
      },
      {
        "role": "assistant",
        "content": `If I had to start over, here's what I would do 👇

1️⃣ - Start a brand new faceless instagram account with a clear target audience in mind
        
2️⃣ - Focus on growing this account and providing value, and serving my audience
        
3️⃣ - Post 3 reels a day and 10 stories, using content banks to make it easier (my favs linked in bio)
        
4️⃣ - Create digital products that solve a problem for my audience or use Done For You digital products
        
5️⃣ - Set up a Stanstore to list and sell these products
        
6️⃣ - Engage with my community and try be as helpful as possible (focusing on serving)
        
Recently I took a new course all about digital marketing that really impressed me!
        
 It's a lower price point but still super comprehensive and it comes with resell rights 👏
        
If you want to check it out,
        
Comment:
        
Digital
        
And I send you a link to check it out!
        
 #plrproducts #mrrdigitalproducts #sellingoninstagram #facelessdigitalmarketingrevolution #facelessaccount #instagramgrowth`
      },
      {role: "user", content: `I need your help to generate another caption for an instagram reel.

      Make the copywritting impeccable and memorable, while being straightforward and like spoken language. Don't overly use adjectives. I want the caption to be very informative and have actionable value for who will read it.
      
      Create me a video caption that targets the ${body.target_audience} audience about the topic "${body.video_topic}". The caption should be like a "How To" for the topic.
      The hook that will appear as text in the video is this: "${body.hook}".
      Also re-write these personal insights into the caption: "${body.personal_insights}".
      In the end, include also a call to action in the form of "${body.call_to_action}".
      Don't write anything else besides the output caption.
      `}
    ]

    const promptStory=[
      {role: "system", content: "You are a viral content expert."},
      {role: "user", content: `I need your help to generate a caption for an instagram reel.

      Make the copywritting impeccable and memorable, while being straightforward and like spoken language. Don't overly use adjectives. I want the caption to be very informative and have actionable value for who will read it.
      
      Create me a video caption that targets the Faceless Instagram creators that want to make money with digital producs audience about the topic "How to make money on instagram". The caption should be like a personal story for the topic.
      The hook that will appear as text in the video is this: "POV: you found a way to work less, but increase your income".
      Also re-write these personal insights into the caption: "When I started, I was a full-time UGC creator. My income was capped by how much I could work. Then I focused on digital products, and now all I have to do is answer questions if there are any.".
      In the end, include also a call to action in the form of "If you want to check out my quickstart guide on faceless marketing comment: Freebie. And I will send you a link to check it out ✨️".
      Don't write anything else besides the output caption.
      `
      },
      {
        "role": "assistant",
        "content": `Let's talk about it 👇

Before I started this account I was a full-time UGC creator - (basically I was making ads for brands) ✨️
        
This was a service based business and so my income was capped by how much work I could get done.
        
1 sale would result in lots of work! - scripting, filming, editing revisions etc 🫣
        
Although I did enjoy this job, I was burnt out and always chasing my next job 😅
        
Once I started focusing on digital products everything changed 👏
        
Now the sales I make get sent automatically to my customers and all I have to do from there is answer questions if they have any!
        
Digital products are not attached to your time in the same way service based businesses are 🙌
        
Meaning they have huge potential to scale!
        
If you want to check out my quickstart guide on faceless marketing
        
Comment:
        
Freebie
        
And I will send you a link to check it out ✨️
        
#plr #mrr #facelessdigtalmarketing #digitalproductsforbeginners #digitalproducts #sellingoninstagram`
      },
      {role: "user", content: `I need your help to generate another caption for an instagram reel.

      Make the copywritting impeccable and memorable, while being straightforward and like spoken language. Don't overly use adjectives. I want the caption to be very informative and have actionable value for who will read it.
      
      Create me a video caption that targets the ${body.target_audience} audience about the topic "${body.video_topic}". The caption should be like a personal story for the topic.
      The hook that will appear as text in the video is this: "${body.hook}".
      Also re-write these personal insights into the caption: "${body.personal_insights}".
      In the end, include also a call to action in the form of "${body.call_to_action}".
      Don't write anything else besides the output caption.
      `}
    ]

    let prompt 
    console.log(body.caption_template)
    if(body.caption_template == "How To"){
      prompt = promptHowTo
    }else if (body.caption_template == "Bullet List"){
      prompt = promptBullet
    }else if (body.caption_template == "Story"){
      prompt = promptStory
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt as any
    });

    const contentWithLineBreaks = response.choices[0].message.content;

    if (!isPro) {
      await incrementApiLimit();
    }


    await prismadb.generated_posts.create({
      data: {
        userId: userId,
        caption: contentWithLineBreaks,
        video_options: JSON.stringify(body)
      },
    })

    return NextResponse.json(contentWithLineBreaks);
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
