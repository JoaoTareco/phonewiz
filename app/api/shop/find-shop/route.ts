import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import axios from 'axios';

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

export async function GET(
    req: NextRequest
  ) {
    try {
      const { userId } = auth();
      const user = await currentUser();
  
      if (!userId || !user) {
        return new Response("Unauthorized", { status: 401 });
      }
  
      const shop_name: string = req.nextUrl.searchParams.get("shop")!;

      const accessToken = process.env.ETSY_ACCESS_TOKEN;
      const headers = { 'x-api-key': `${accessToken}` };

      const etsyApiUrl = `https://openapi.etsy.com/v3/application/shops?shop_name=${encodeURIComponent(shop_name)}`;

      const response = await axios.get(etsyApiUrl, { headers });

      return new Response(JSON.stringify(response.data), {status: 200});
  
    } catch (error) {
      console.log('[CONVERSATION_ERROR]', error);
      return new Response("Internal Error", { status: 500 });
    }
  };  