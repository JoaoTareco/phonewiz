"use client";

import axios from "axios";
import { Key, useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, MessagesSquare, MoveUpRight, Zap, History, FileStack, FileVideo } from "lucide-react";
import { toast } from "react-hot-toast";


import { Button } from "@/components/ui/button";

import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";

interface PostHistoryrops {
  setStep: (newValue: number) => void;
  setInputProps: (props: any) => void;
  setPostHistoryOut: (props: any) => void;
  postHistoryOut: any;
}

export const PostHistory: React.FC<PostHistoryrops> = ({ setStep, setInputProps, setPostHistoryOut, postHistoryOut }) => {
  const [postHistory, setPostHistory] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/get-post-history`);
        setPostHistory(response.data)
        setPostHistoryOut(response.data)
        console.log(response.data)
        console.log(JSON.parse(response.data[0].video_options))
      } catch (error) {
        console.error('API Error:', error);
      }
    };
    if(!postHistoryOut){
      fetchData();
    } else {
      setPostHistory(postHistoryOut)
    }
  }, []);


  const captionPlayground = () => {
    setInputProps(null)
    setStep(5)
  }

  const videoGenerator = () => {
    setInputProps(null)
    setStep(1)
  }

  const setProps = (post: any) => {
    console.log(post)
    setInputProps(post)
    setStep(5)
  }

  return (
    <div className="">
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-1">
            <div className="h-60 object-cover transition-all justify-center text-center rounded-md border border-dashed p-1">
                <h3 className="mt-16 text-lg font-semibold">Caption Playground</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Generate new captions and hooks with a tailored interface.
                </p>
                <div className="mt-5">
                  <Button onClick={captionPlayground}>
                  <FileStack size={16} className="mr-2"/> Generate 
                  </Button>
                </div>
              </div>
          </div>
          <div className="col-span-1">
            <div className="h-60 object-cover transition-all justify-center text-center rounded-md border border-dashed p-1">
                <h3 className="mt-16 text-lg font-semibold">Full Post With Video</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Generate new captions and hooks, together an edited video.
                </p>
                <div className="">
                 <Button onClick={videoGenerator}>
                 <FileVideo size={16} className="mr-2"/> Generate 
                  </Button>
                </div>
              </div>
          </div>
        </div>
            
       {postHistory.length > 0 && (
        <div>
        <Separator className="mt-10"/>
        
        <h2 className="my-5 text-xl font-medium">Caption History</h2> 
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4">
          {postHistory.map((post: any, index: Key | null | undefined) => (
            <div key={index} className="col-span-1">
              <Card className="">
                <CardHeader>
                  <span className="font-semibold">{JSON.parse(post.video_options).video_topic}</span>
                </CardHeader>
                <CardContent>

                <span className="bg-gradient-to-b from-black to-transparent inline-block text-transparent bg-clip-text">{post.caption.substring(0,120)}</span>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="font-thin text-xs">{post.created_at.substring(0,10)}</span>
                  <Button variant={"link"} className="text-xs" onClick={() => setProps(post)}>
                    See caption<ArrowRight size={14} className="ml-1"/>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
           </div>
           </div>)
      }
      </div>
  )
}
