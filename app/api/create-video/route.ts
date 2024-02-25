import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const Creatomate = require('creatomate');

const client = new Creatomate.Client(process.env.CREATOMATE_API_KEY);

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

    console.log(body.hook)

    // if (!prompt) {
    //   return new NextResponse("Prompt is required", { status: 400 });
    // }

    // if (!amount) {
    //   return new NextResponse("Amount is required", { status: 400 });
    // }

    // if (!resolution) {
    //   return new NextResponse("Resolution is required", { status: 400 });
    // }

    // const isPro = await checkSubscription();

    // if (!freeTrial && !isPro) {
    //   return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    // }

    const template_options = {
      // The ID of the template that you created in the template editor
      templateId: '8b27d687-9a85-44a0-a042-0ec06855bc4f',

      // Modifications that you want to apply to the template
      modifications: {
        "Music": "https://cdn.creatomate.com/files/assets/b5dc815e-dcc9-4c62-9405-f94913936bf5",
        "Background-3": "https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/user_2aPY12uVo8oyqxKieBV7qpNOgOJ/IMG_2199.mp4",
        "Background-4": "https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/user_2aPY12uVo8oyqxKieBV7qpNOgOJ/IMG_2200.mp4",
        "Text-4": "Read Caption ⬇️",
        "Text-1": body.hook
      },
    };

    console.log('Please wait while your video is being rendered...');

    client.render(template_options)
      .then((renders: any) => {
        console.log('Completed:', renders);
        
      })
      .catch((error: any) => console.error(error));


    // if (!isPro) {
    //   await incrementApiLimit();
    // }
  } catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
