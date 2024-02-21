import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import axios from 'axios';

import { match } from 'fuzzyjs';
import Fuse from 'fuse.js';


import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()

// import { checkSubscription } from "@/lib/subscription";
// import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

function getUniqueKeywords(keywords: string[]): string[] {
    let options = {
        includeScore: true,
        threshold: 0.35, // You can adjust the threshold as needed
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
    };

    let fuse = new Fuse(keywords, options);

    const keywordsForRemoval = []

    let uniqueKeywords = new Set<string>();
    for (let keyword of keywords) {
        let result = fuse.search(keyword);
        if (result.length > 1) {
            if(!keywordsForRemoval.includes(keyword)){
                uniqueKeywords.add(keyword);
                result.forEach((word) => {
                    keywordsForRemoval.push(word.item)
                })
            }
        }else{
            uniqueKeywords.add(keyword);
        }
    }

    return Array.from(uniqueKeywords);
}

export async function GET(req: NextRequest) {
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
        suggested_keyword: true,

    },
    where: {
            AND: [
            { etsy_listings_count: { lt: 10000 } },
            { etsy_listings_count: { gt: 500 } },
            { google_sv: { gt: 10 } },
            { google_sv: { lt: 10000 } },
            { rankibility: { gt: 50 }  }
            ],
    },
    distinct: ['suggested_keyword']
    });

    // Fetch the suggested_keyword data
    const suggestedKeywords = await prisma.keyword_suggestions_list.findMany({
    select: {
        suggested_keyword: true,
        id: true
    },
    distinct: ['id']
    });

    const listingImages = await prisma.$queryRaw`
    SELECT DISTINCT ON (keyword) image, keyword FROM etsy_listing_list order by keyword, views desc
    `

    // Combine the data
    const combinedDataAux = selectedListings.map(listing => ({
        sv_trend: listing.sv_trend,
        rankibility: listing.rankibility,
        google_sv:  listing.google_sv,
        etsy_listings_count:  listing.etsy_listings_count,
        suggested_keyword: suggestedKeywords.find(keyword => keyword.id === listing.suggested_keyword).suggested_keyword,
    }));

    const combinedData = combinedDataAux.map(listing => {
        const keywordImage = listingImages.find(list => list.keyword === listing.suggested_keyword);
        return { 
            sv_trend: listing.sv_trend,
            rankibility: listing.rankibility,
            google_sv:  listing.google_sv,
            etsy_listings_count:  listing.etsy_listings_count,
            suggested_keyword: listing.suggested_keyword,
            image: keywordImage ? keywordImage.image : null
        }
    });

    // Extract the keywords
    const keywords = combinedData.map(item => item.suggested_keyword);

    // Get the unique keywords
    const uniqueKeywords = getUniqueKeywords(keywords);


  // console.log(uniqueKeywords)seD


   const filteredData = combinedData.filter(item => uniqueKeywords.some(word => item.suggested_keyword === word));

  // console.log(filteredData)

    return new Response(JSON.stringify(filteredData), {status: 200});
 
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new Response("Internal Error", { status: 500 });
  }
};
 
