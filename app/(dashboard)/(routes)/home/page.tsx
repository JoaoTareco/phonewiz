"use client"

import { useEffect, useState } from "react";
import { ArrowBigRight, FileStack, FileVideo, Home, PenLine, Plus, Settings } from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { PostHistory } from "@/components/post-history";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WobbleCard } from "@/components/wobble-card";
import { motion } from "framer-motion";
import { Loader } from "@/components/loader";

const HomePage = () => {
  const [postHistory, setPostHistory] = useState<boolean>(true);
  const [audience, setAudience] = useState<boolean>(true);
  const [contentBank, setContentBank] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postHistoryResponse, audienceResponse, contentResponse] = await Promise.all([
          fetch('/api/get-post-history'),
          fetch('/api/get-audience'),
          fetch('/api/get-content')
        ]);

        const postHistoryData = await postHistoryResponse.json();
        const audienceData = await audienceResponse.json();
        const contentData = await contentResponse.json();

        if (postHistoryData.length === 0) {
          setPostHistory(false);
        }
        if (audienceData === null) {
          setAudience(false);
        }
        if (contentData.all_videos.length === 0) {
          setContentBank(false);
        }
       
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return ( 
    <div>
      <Heading
        title="Welcome to Ctrlcap"
        description="Your AI Short Video Creation Tool."
        icon={Home}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <Separator className="mb-4" />
        
        {/* New card for first steps */}
        {(!postHistory || !audience || !contentBank) ? (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4 mb-4 bg-[#f6f6f6] border shadow-sm text-gray-900" >
              <h3 className="text-lg font-semibold mb-2">Your first steps to <span className="text-primary">start creating content</span></h3>
              <div className="pl-5">
                {!contentBank && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="flex items-center"
                  >
                    <Button variant="token" size="sm" onClick={() => window.location.href = '/content-bank'}> <ArrowBigRight className="w-4 h-4 mr-2 text-muted-foreground" />Add content to your Content Bank <span className="text-muted-foreground text-sm ml-2"></span></Button>
                  </motion.div>
                )}
                {!audience && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="flex items-center"
                  >
                    <Button variant="token" size="sm" onClick={() => window.location.href = '/content-planner'}> <ArrowBigRight className="w-4 h-4 mr-2 text-muted-foreground" />Define your audience in the Content Planner <span className="text-muted-foreground text-sm ml-2"></span></Button>
                  </motion.div>
                )}
                {!postHistory && (
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="flex items-center"
                  >
                    <Button variant="token" size="sm" onClick={() => window.location.href = '/post-generator'}> <ArrowBigRight className="w-4 h-4 mr-2 text-muted-foreground" />Create your first post in the Post Generator <span className="text-muted-foreground text-sm ml-2"></span></Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        ) : (postHistory === null || audience === null || contentBank === null) ? (
          <div className="flex justify-center items-center h-20">
            <Loader />
          </div>
        ) : null}

        <div className="grid grid-rows-2 gap-2">
          <div className="row-span-1">
            <Card className="object-cover transition-all justify-center text-center h-[16rem] p-1 ">
                <h3 className="mt-16 text-lg font-semibold">Post Generator</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Generate a new video with a caption and a hook.
                </p>
                <div className="">
                 <Button onClick={() => window.location.href = '/post-generator'}>
                 <FileVideo size={16} className="mr-2"/> Create a Post 
                  </Button>
                </div>
              </Card>
          </div>
          <div className="row-span-1">
            <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1">
              <Card className="object-cover transition-all justify-center text-center h-[12rem] p-1">
                <h3 className="mt-8 text-lg font-semibold">Content Planner</h3>
                <p className=" mt-2 text-sm text-muted-foreground">
                Generate content plans to always know what to post.
                </p>
                <div className="mt-5">
                  <Button onClick={() => window.location.href = '/content-planner'}>
                  <FileStack size={16} className="mr-2"/> Create a Plan 
                  </Button>
                </div>
              </Card>
            </div>
            <div className="col-span-1">
              <Card className="object-cover transition-all justify-center text-center h-[12rem] p-1">
                <h3 className="mt-8 text-lg font-semibold">Caption Playground</h3>
                <p className=" mt-2 text-sm text-muted-foreground">
                 Generate new captions.
                </p>
                <div className="mt-5">
                  <Button onClick={() => window.location.href = '/caption-playground'} >
                  <PenLine size={16} className="mr-2"/> Create a Caption
                  </Button>
                </div>
              </Card>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default HomePage;

