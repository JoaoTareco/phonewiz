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
  
      const shop_id: string = req.nextUrl.searchParams.get("shop_id")!;

      const accessToken = process.env.ETSY_ACCESS_TOKEN;
      const headers = { 'x-api-key': `${accessToken}` };

      const [shopResponse, listingsResponse] = await Promise.all([
        axios.get(`https://openapi.etsy.com/v3/application/shops/${shop_id}`, { headers }),
        axios.get(`https://openapi.etsy.com/v3/application/shops/${shop_id}/listings`, { headers })
      ]);
 
      let totalSales = shopResponse.data.transaction_sold_count;
      let totalPrices = 0;
      let totalViews = 0;
 
      listingsResponse.data.results.forEach((listing: any) => {
        totalViews += listing.views;
        totalPrices += listing.price ;
      });

      const averagePrice = totalPrices / listingsResponse.data.count;
 
      const lifetimeRevenue = averagePrice * totalSales;
      const conversionRate = totalSales / totalViews;

      // Convert the create_date from epoch seconds to a JavaScript Date object.
      const createDate = new Date(shopResponse.data.create_date * 1000);

      // Calculate the number of months between the create_date and the current date.
      const currentDate = new Date();
      const months = currentDate.getMonth() - createDate.getMonth() + (12 * (currentDate.getFullYear() - createDate.getFullYear()));

      const monthlySales = totalSales/months;

      const monthlyRevenue = averagePrice * monthlySales;

      const salesPerListing = totalSales / listingsResponse.data.count;

      const listings = listingsResponse.data.results;

      const shopScore = shopResponse.data.review_average;

      const reviewRate = shopResponse.data.review_count;

      return new Response(JSON.stringify({
        totalSales,
        lifetimeRevenue,
        conversionRate,
        monthlySales,
        monthlyRevenue,
        salesPerListing,
        averagePrice,
        listings,
        reviewRate,
        shopScore
      }), {status: 200});
  
    } catch (error) {
      console.log('[CONVERSATION_ERROR]', error);
      return new Response("Internal Error", { status: 500 });
    }
  };  