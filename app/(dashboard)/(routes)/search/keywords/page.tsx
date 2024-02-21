"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/router';
import { Loader } from "@/components/loader";

import { Eye, Users } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import { Button } from "@/components/ui/button"

import '@/app/globals.css';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


export const options = {
  scales: {
    y: {
      ticks: {
        display: false,
      }
    }
  },
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false,
      text: 'Chart.js Line Chart',
    },
  },
};

interface Listing {
  id: string;
  url: string;
  title: string;
  image: any;
  views: number;
}

interface keywordSuggestions {
  keyword: string;
  search_volume: number;
  rankability: number;
}

interface tagList {
  tag: string;
  occurrences: number;
}

let data = {
  labels: [],
  datasets: [
    {
      label: 'Search Volume',
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'hsl(var(--primary))',
      data: []
    }
  ]
};

function formatMonth(month: string, year: number): string {
  const months: Record<string, string> = {"JAN":"Jan", "FEB":"Feb", "MAR":"Mar", "APR": "Apr", "MAY": "May", "JUN": "Jun", "JUL": "Jul", "AUG": "Aug", "SEP": "Sep", "OCT": "Oct", "NOV": "Nov", "DEC": "Dec"};
  const month_id = month.substring(0, 3);
  return `${months[month_id]} ${year}`;
}

interface MonthlyData {
  year: number;
  month: string;
  searches: number;
}

interface seasonalityState {
  season: string;
  description: string;
}

function getSeasonality(data: MonthlyData[]): { season: string; description: string } {
  // Define your seasons and their corresponding months
  const seasons: { name: string; months: string[] }[] = [
    { name: "Winter", months: ["12", "1", "2"] },
    { name: "Spring", months: ["3", "4", "5"] },
    { name: "Summer", months: ["6", "7", "8"] },
    { name: "Fall", months: ["9", "10", "11"] },
  ];

  // Calculate total search volume for each season
  const seasonVolumes: { [season: string]: number } = {};

  data.forEach((entry) => {
    const season = seasons.find((s) => s.months.includes(entry.month));
    if (season) {
      if (!seasonVolumes[season.name]) {
        seasonVolumes[season.name] = 0;
      }
      seasonVolumes[season.name] += entry.searches;
    }
  });

  // Define descriptions for each season
  const seasonDescriptions: { [season: string]: string } = {
    Winter: "Winter Months",
    Spring: "Spring Months",
    Summer: "Summer Months",
    Fall: "Fall Months",
  };

  // Set a threshold to consider a season as significant
  const threshold = 200; // Adjust as needed

  let maxSeason = "None";
  let maxVolume = 0;

  for (const season in seasonVolumes) {
    if (seasonVolumes[season] >= threshold && seasonVolumes[season] > maxVolume) {
      maxSeason = season;
      maxVolume = seasonVolumes[season];
    }
  }

  if (maxSeason === "None") {
    return { season: "None", description: "All Seasons" };
  }

  return { season: maxSeason, description: seasonDescriptions[maxSeason] };
}

export default function DashboardPage() {

  const [inputText, setInputText] = useState<string>(''); // Specify the type for inputText
  const [listingCount, setListingCount] = useState<string | null>(null); // Initialize as null
  const [averageViews, setAverageViews] = useState<string | null>(null); // Initialize as null
  const [rankability, setRankability] = useState<number | null>(null); // Initialize as null
  const [searchVolume, setSearchVolume] = useState<string | null>(null); // Initialize as null
  const [competition, setCompetition] = useState<number | null>(null); // Initialize as null
  const [topListings, setTopListings] = useState<Listing[]>([]);
  const [seasonality, setSeasonality] = useState<seasonalityState[]>([]);
  const [keywordSuggestions, setKeywordSuggestions] = useState<keywordSuggestions[]>([]);
  const [tagList, setTagList] = useState<tagList[]>([]);
  const [chartData, setChartData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedSearch, setSubmittedSearch] = useState(false);


async function searchKeyword(keyword: string){

     // Make a request to your API endpoint with Axios
    try {
      setIsLoading(true);

        // Use Promise.all to make both requests concurrently
      const [response, response2] = await Promise.all([
        axios.get(`/api/keyword-search/etsy?keyword=${keyword}`),
        axios.get(`/api/keyword-search/google?keyword=${keyword}`)
      ]);

      setListingCount((response.data.total_listings).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // Set the listing count in state
      setTopListings(response.data.top_listings.slice(0, 8));
      setAverageViews((response.data.average_views).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))

      setRankability(response2.data[0].rankability)
      setSearchVolume((response2.data[0].search_volume).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
      setCompetition(response2.data[0].ranking)

      setKeywordSuggestions(response2.data.slice(1, 10))

      setTagList(response.data.tags.slice(0, 8))

      // setSeasonality(getSeasonality(response2.data.keyword_values[0].monthly_data))

      const monthlyData = response2.data[0].monthly_data;

      // const newLabels = monthlyData.map((entry: any) =>
      //   formatMonth(entry.month, entry.year)
      // );
      // const newData = monthlyData.map((entry: any) => entry.monthly_searches);

       // Update the chart data and options
      //  setChartData({
      //   labels: newLabels,
      //   datasets: [
      //     {
      //       label: 'Search Volume',
      //       backgroundColor: 'rgba(75,192,192,0.4)',
      //       borderColor: 'hsl(var(--destructive))',
      //       data: newData,
      //     },
      //   ],
      // });

      setChartData(monthlyData);

    } catch (error) {
      // Handle errors here
      console.error('API Error:', error);
    } finally {
      setIsLoading(false); 
      setSubmittedSearch(true)
    }

}


  // useEffect(() => {

  //   const router = useRouter();
  //   const { keyword } = router.query;

  //   console.log(keyword)

  //   if(keyword){
  //       searchKeyword(keyword)
  //   }
  // }); 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    searchKeyword(inputText)

  };

  return (
    <>
    <div>
     <h2 className="text-2xl md:text-2xl font-medium ml-5">
        Search Keywords
      </h2>
     <form onSubmit={handleSubmit} className="m-4 grid grid-cols-8 mt-10">
          <input
            type="text"
            id="keywordInput"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full col-span-7"
            placeholder="Enter a keyword"
          />
          <Button
            type="submit"
            className="col-span-1 mx-2"
          >
            Search
          </Button>
        </form>   
    </div>
     {submittedSearch ? (
     <div >                                                                          
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 m-4">
          
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isLoading ? (
                        <Skeleton className="h-4 w-[100px]" /> // Render the skeleton while loading
                      ) : (
                        <div>Rankibility</div> // Render the actual content when not loading
                      )}
                    </CardTitle>
                    <svg width="19px" height="18px" viewBox="0 0 1024 1024" fill="#000000" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="#71717A" d="M324.8 440c34.4 0 62.4-28 62.4-62.4s-28-62.4-62.4-62.4-62.4 28-62.4 62.4 28 62.4 62.4 62.4z m374.4 0c34.4 0 62.4-28 62.4-62.4s-28-62.4-62.4-62.4-62.4 28-62.4 62.4 28 62.4 62.4 62.4zM340 709.6C384 744 440.8 764.8 512 764.8s128-20.8 172-55.2c26.4-21.6 42.4-42.4 50.4-58.4 6.4-12 0.8-27.2-11.2-33.6s-27.2-0.8-33.6 11.2c-0.8 1.6-3.2 6.4-8 12-7.2 10.4-17.6 20-28.8 29.6-34.4 28-80.8 44.8-140.8 44.8s-105.6-16.8-140.8-44.8c-12-9.6-21.6-20-28.8-29.6-4-5.6-7.2-9.6-8-12-6.4-12-20.8-17.6-33.6-11.2s-17.6 20.8-11.2 33.6c8 16 24 36.8 50.4 58.4z" fill=""/>
                    <path stroke="#71717A" d="M512 1010.4c-276.8 0-502.4-225.6-502.4-502.4S235.2 5.6 512 5.6s502.4 225.6 502.4 502.4-225.6 502.4-502.4 502.4zM512 53.6C261.6 53.6 57.6 257.6 57.6 508s204 454.4 454.4 454.4 454.4-204 454.4-454.4S762.4 53.6 512 53.6z" fill=""/>
                    </svg>
                    </CardHeader>
                  <CardContent>
                     {isLoading ? (
                        <Skeleton className="h-6 w-[120px]" /> // Render the skeleton while loading
                      ) : (
                         <div className="text-2xl font-bold">{rankability}</div>
                      )}
                    {/* <p className="text-xs text-muted-foreground">
                      Easy to rank
                    </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                     {isLoading ? (
                        <Skeleton className="h-4 w-[100px]" /> // Render the skeleton while loading
                      ) : (
                        <div> Search Volume</div> // Render the actual content when not loading
                      )}
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                  {isLoading ? (
                        <Skeleton className="h-6 w-[120px]" /> // Render the skeleton while loading
                      ) : (
                         <div className="text-2xl font-bold">{searchVolume}</div>
                      )}
                    {/* <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    {isLoading ? (
                        <Skeleton className="h-4 w-[100px]" /> // Render the skeleton while loading
                      ) : (
                        <div>Competition</div> // Render the actual content when not loading
                      )}
                    </CardTitle>
                        <svg width="22px" height="22px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#71717A" fill="none"><path d="M23.87,51.54,16.31,44,31.77,28.51,24,23.57a.66.66,0,0,1,.2-1.19l26-6.09a.65.65,0,0,1,.79.77l-5.6,26.5a.66.66,0,0,1-1.2.22l-4.91-7.7Z"/></svg>
                  </CardHeader>
                  <CardContent>
                  {isLoading ? (
                        <Skeleton className="h-6 w-[120px]" /> // Render the skeleton while loading
                      ) : (
                         <div className="text-2xl font-bold">{competition}</div>
                      )}
                    {/* <p className="text-xs text-muted-foreground">
                      +0.1% from last month
                    </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                     {isLoading ? (
                        <Skeleton className="h-4 w-[100px]" /> // Render the skeleton while loading
                      ) : (
                        <div>Listing Count</div> // Render the actual content when not loading
                      )}
                    </CardTitle>
                    <Users className="w-4 h-4 ml-2 fill-black"/>
                  </CardHeader>
                  <CardContent>
                   {isLoading ? (
                        <Skeleton className="h-6 w-[120px]" /> // Render the skeleton while loading
                      ) : (
                         <div className="text-2xl font-bold">{listingCount}</div>
                      )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {isLoading ? (
                        <Skeleton className="h-4 w-[100px]" /> // Render the skeleton while loading
                      ) : (
                        <div>Average Views</div> // Render the actual content when not loading
                      )}
                    </CardTitle>
                   <Eye className="w-4 h-4 ml-2 fill-black" />
                  </CardHeader>
                  <CardContent>
                  {isLoading ? (
                        <Skeleton className="h-6 w-[120px]" /> // Render the skeleton while loading
                      ) : (
                         <div className="text-2xl font-bold">{averageViews}</div>
                      )}
                    <p className="text-xs text-muted-foreground">
                      Per Month
                    </p>
                  </CardContent>
                </Card>
                {/* <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Seasonality
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Oct-Dec</div>
                    <p className="text-xs text-muted-foreground">
                      Winter Months
                    </p>
                  </CardContent>
                </Card> */}
              </div>




              <div className="grid grid-cols-4 grid-flow-col gap-4 m-4">
              <Card className="col-span-2">
                    <CardHeader>
                        <div className="flex justify-between">
                        <CardTitle>
                         {isLoading ? (
                            <Skeleton className="h-4 w-[100px]" /> // Render the skeleton while loading
                          ) : (
                            <div>Search Volume Trend</div> // Render the actual content when not loading
                          )}
                        </CardTitle>
                        {/* <div className="flex-none">
                        <div className="flex justify-between">
                        <div className="flex-none px-2">
                            <div className="text-muted-foreground text-center text-xs">Growth</div>
                            <div className="text-foreground text-center text-base">+350%</div>
                        </div>
                        </div>
                        </div> */}
                        </div>
                    </CardHeader>
                    <CardContent>
                         {isLoading ? (
                            <Skeleton className="h-[450px] w-[450px] pt-10" /> // Render the skeleton while loading
                          ) : (
                            <div className="justify-start">
                            <ResponsiveContainer width='100%' height={450}>
                            <LineChart data={chartData}>
                              <XAxis
                                dataKey="name"
                                stroke="#111728"
                                fontSize={8}
                                tickLine={true}
                                axisLine={true}
                              />
                              <YAxis
                                stroke="#111728"
                                fontSize={8}
                                // padding={{ top: 30 }}
                                allowDataOverflow={false}
                                width={40}
                                tickLine={true}
                                axisLine={true}
                                tickFormatter={(value) => `${value}`}
                              />
                              <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                              <Line type="monotone" dataKey="searches" stroke="#111728" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                          </div>
                          )}
                    </CardContent>
                     </Card>
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                  <Table>
                      <TableCaption>Top Tags Used in Listings</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tag</TableHead>
                          <TableHead>Occurrences</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tagList.map((tag) => (
                          <TableRow key={tag.tag}>
                            <TableCell>{tag.tag}</TableCell>
                            <TableCell>{tag.occurrences}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
               <div className="grid grid-rows-8 grid-flow-col gap-4 md:grid-cols-2 lg:grid-cols-9 m-4">
               <Card className="row-span-8 col-span-9">
                  <CardHeader>
                    <CardTitle>Top Listings</CardTitle>
                    <CardDescription>
                      Top listings for keyword on Etsy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableCaption>Top Listings for the keyword on Etsy.</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Views</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topListings.map((listing) => (
                          <TableRow key={listing.id}>
                            <TableCell>
                              <img className="rounded-lg" src={listing.image[0].url_fullxfull} alt={listing.title} style={{ width: '200px', height: '175px' }} />
                            </TableCell>
                            <TableCell>{listing.title}</TableCell>
                            <TableCell>{listing.views}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                 </div>
              <div className="grid grid-rows-8 grid-flow-col gap-4 md:grid-cols-2 lg:grid-cols-9 m-4">
               <Card className="row-span-8 col-span-9">
                  <CardHeader>
                    <CardTitle>Keyword Suggestions</CardTitle>
                    <CardDescription>
                      Top suggested keywords based on searches.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                  <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Search Volume</TableHead>
                          <TableHead>Rankability</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywordSuggestions.map((keywords) => (
                          <TableRow key={keywords.keyword}>
                            <TableCell>{keywords.keyword}</TableCell>
                            <TableCell>{keywords.search_volume}</TableCell>
                            <TableCell>{keywords.rankability}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                </div>
              </div>
    ) : (
      <div>
        {isLoading ? (
            <div className="flex justify-center pt-20">
                <div className="p-8 rounded-lg w-full flex items-center justify-center">
                  <Loader />
                </div>
            </div> 
          ) : (
            <div>
            </div>
          )}
        </div>                
    )}
    </>
  )
}