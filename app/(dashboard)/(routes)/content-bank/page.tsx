"use client";

import axios from "axios";
import { Key, useEffect, useState } from "react";


import {  Videotape } from "lucide-react";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useProModal } from "@/hooks/use-pro-modal";


import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react"
import { DialogClose } from "@radix-ui/react-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from '@clerk/nextjs';

import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import Tus from '@uppy/tus';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';


const api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZHRyeHRtaHd4d255d3NwZnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwMjM0NzksImV4cCI6MjAxOTU5OTQ3OX0.hTwPwcu50pbBDZIod4hz029-2cA5rCDzw_ZYSGclNMA';
const project_id = 'modtrxtmhwxwnywspfuf';


const VideoPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [videos, setVideos] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [reloadVideos, setReloadVideos] = useState<boolean>(false);
  const [file, setFile] = useState<File>()


  var uppy = new Uppy()
  .use(Tus, {
    endpoint: `https://${project_id}.supabase.co/storage/v1/upload/resumable`,
    headers: {
      authorization: `Bearer ${api_key}`,
    },
    chunkSize: 6 * 1024 * 1024,
    allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl'],
  })

  uppy.on('file-added', (file) => {
    file.meta = {
      ...file.meta,
      bucketName: 'content-bank',
      objectName:  `${userId}/${file.name}`,
      contentType: file.type,
    }
  })
  
  uppy.on('complete', (result) => {
    setUploaded(true)
    console.log('Upload complete! We’ve uploaded these files:', result.successful)
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/get-content`);
        setVideos(response.data.map((item: any) => item.video));
        const userData = await axios.get(`/api/get-user-id`);
        setUserId(userData.data)
        console.log(userId)
      } catch (error) {
        console.error('API Error:', error);
      } finally{
        setIsLoading(false)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReloadVideos(true)
        const response = await axios.get(`/api/get-content`);
        setVideos(response.data.map((item: any) => item.video));
        setReloadVideos(false)
        setUploaded(false)
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    fetchData();
  }, [uploaded]);

  return ( 
    <div>
      <Heading
        title="Content Bank"
        description="Upload your videos to be used in content generation."
        icon={Videotape}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8">
        <Separator className="my-4" />
        {!reloadVideos && (
             <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              <div className="h-96 w-64 object-cover transition-all aspect-[3/4] justify-center text-center rounded-md border border-dashed">
                <h3 className="mt-20 text-lg font-semibold">Add a new video</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Increase your content bank
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircledIcon className="mr-2 h-4 w-4" />
                      Upload video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="justify-center">
                    <DialogHeader>
                      <DialogTitle>Add Video</DialogTitle>
                      <DialogDescription>
                        Please make sure it is longer than 3 seconds.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex pt-5">{uppy && <Dashboard uppy={uppy} closeAfterFinish={false} note={'Videos longer than 3 seconds only, up to 30 MB'} className="w-[450px]"/>}</div>
                  </DialogContent>
                </Dialog>
              </div>
  
              {videos.map((videoUrl: string | undefined, index: Key | null | undefined) => (
                  <video className="h-96 w-64 object-cover transition-all hover:scale-105 aspect-[3/4] rounded-md" key={index}
                  controls={false} 
                  autoPlay
                  muted
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                ))}
         
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>)}
      </div>
      {/* {uploading && (
      <div className="place-content-end w-40 h-4">
        <Card className="shadow-xl">
          <CardContent>
          <div className=" flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <p className="text-sm font-medium leading-none">
              Uploading Content
            </p>
            </div>
            </CardContent>
        </Card>
      </div>)} */}
    </div>
   );
}
 
export default VideoPage;
