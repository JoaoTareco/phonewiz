"use client";

import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/router';
import { Loader } from "@/components/loader";

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


export default function DashboardPage() {

  const [inputText, setInputText] = useState<string>(''); // Specify the type for inputText
  const [isLoading, setIsLoading] = useState(false);
  const [submittedSearch, setSubmittedSearch] = useState(false);


async function searchKeyword(shop_name: string){

     // Make a request to your API endpoint with Axios
    try {
      setIsLoading(true);

      // Use Promise.all to make both requests concurrently
      const [response] = await Promise.all([
        axios.get(`/api/shop/find-shop?shop=${shop_name}`)
      ]);


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
        Search Shops
      </h2>
     <form onSubmit={handleSubmit} className="m-4 grid grid-cols-8 mt-10">
          <input
            type="text"
            id="shopInput"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full col-span-7"
            placeholder="Enter a Shop Name"
          />
          <Button
            type="submit"
            className="col-span-1 mx-2"
          >
            Search
          </Button>
        </form>   
    </div>
    </>
  )
}