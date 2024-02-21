import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import axios from 'axios';

import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()

// import { checkSubscription } from "@/lib/subscription";
// import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";


 export async function GET(
  req: NextRequest
 ) {
  try {
      const { userId } = auth();
      const user = await currentUser();
  
      if (!userId || !user) {
        return new Response("Unauthorized", { status: 401 });
      }

          // Fetch the keyword_stats data
      const selectedListings = await prisma.keyword_stats.findMany({
        select: {
          sv_trend: true,
          rankibility: true,
          google_sv: true,
          etsy_listings_count: true,
          suggested_keyword: true
        },
        where: {
          OR: [
            {
              AND: [
                { etsy_listings_count: { lt: 1200 } },
                { etsy_listings_count: { gt: 700 } },
              ],
            },
            {
              rankibility: { gt: 50 },
            },
          ],
        },
      });

      // Fetch the suggested_keyword data
      const suggestedKeywords = await prisma.keyword_suggestions_list.findMany({
        select: {
          suggested_keyword: true,
          id: true
        },
      });

      // // Combine the data
      // const combinedData = selectedListings.map(listing => ({
      //    sv_trend: listing.sv_trend,
      //   rankibility: listing.rankibility,
      //   google_sv:  listing.google_sv,
      //   etsy_listings_count:  listing.etsy_listings_count,
      //   suggested_keyword: suggestedKeywords.find(keyword => keyword.id === listing.suggested_keyword).suggested_keyword,
      // }));

      return new Response(JSON.stringify('combinedData'), {status: 200});
 
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new Response("Internal Error", { status: 500 });
  }
 };
 
