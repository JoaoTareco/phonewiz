import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await fetch('https://aitable.ai/fusion/v1/datasheets/dstmaBg6YMZ0RqXZk7/records?viewId=viwu90rRLNDH5&fieldKey=name', {
      headers: {
        'Authorization': 'Bearer usk1XPGa2GLcFGADNMUgBcJ'
      }
    });
    const data = await response.json();

    
    return new NextResponse(JSON.stringify(data));
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
