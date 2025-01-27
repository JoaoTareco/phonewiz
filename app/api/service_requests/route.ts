import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await fetch('https://aitable.ai/fusion/v1/datasheets/dstjT2S10AyUA2D9ud/records?viewId=viwyq30gD0usA&fieldKey=name', {
      headers: {
        'Authorization': 'Bearer usk1XPGa2GLcFGADNMUgBcJ'
      }
    });
    const data = await response.json();

    // Transform the data to include only the required fields
    const transformedData = data.data.records.map(record => ({
      serviceType: record.fields["Service Type "]?.[0] || "",
      status: record.fields["Status "] || "",
      description: record.fields["Description"] || "",
      createdAt: new Date(record.createdAt).toISOString().split('T')[0]
    }));

    return new NextResponse(JSON.stringify(transformedData));
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
