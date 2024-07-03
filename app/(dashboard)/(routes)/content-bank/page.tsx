"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import Tus from '@uppy/tus';
import { Videotape } from 'lucide-react';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';


const api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZHRyeHRtaHd4d255d3NwZnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwMjM0NzksImV4cCI6MjAxOTU5OTQ3OX0.hTwPwcu50pbBDZIod4hz029-2cA5rCDzw_ZYSGclNMA';
const project_id = 'modtrxtmhwxwnywspfuf';


const VideoPage = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [reloadVideos, setReloadVideos] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);

  const uppy = new Uppy();

  uppy.use(Tus, {
    endpoint: `https://${project_id}.supabase.co/storage/v1/upload/resumable`,
    headers: {
      authorization: `Bearer ${api_key}`,
    },
    chunkSize: 6 * 1024 * 1024,
    allowedMetaFields: ['bucketName', 'objectName', 'contentType', 'cacheControl'],
  });

  uppy.on('file-added', (file) => {
    file.meta = {
      ...file.meta,
      bucketName: 'content-bank',
      objectName: `${userId}/${file.name}`,
      contentType: file.type,
    };
  });

  uppy.on('complete', (result) => {
    setUploaded(true);
    console.log('Upload complete! We’ve uploaded these files:', result.successful);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/get-content`);
        setVideos(response.data.all_videos);
        const userData = await axios.get(`/api/get-user-id`);
        setUserId(userData.data);
        setLoadingStates(new Array(response.data.length).fill(true));
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReloadVideos(true);
        const response = await axios.get(`/api/get-content`);
        setVideos(response.data.all_videos);
        setLoadingStates(new Array(response.data.length).fill(true));
        setReloadVideos(false);
        setUploaded(false);
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    fetchData();
  }, [uploaded]);

  const handleLoadedData = (index: number) => {
    const newLoadingStates = [...loadingStates];
    newLoadingStates[index] = false;
    setLoadingStates(newLoadingStates);
  };


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
        <div className="relative flex justify-center">
          <ScrollArea>
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 md:grid-cols-2 gap-4 max-w-fit ">
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
                    <div className="flex pt-5">
                      {uppy && (
                        <Dashboard
                          uppy={uppy}
                          plugins={['Dashboard']}
                          closeAfterFinish={false}
                          note={'Videos longer than 3 seconds only, up to 30 MB'}
                          className="w-[450px]"
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {reloadVideos && (
                    <Skeleton className="h-96 w-64 object-cover transition-all aspect-[3/4] rounded-md" />
                  )}

              {videos.map((videoUrl: string | undefined, index: any) => (
                <div key={index}>
                  {reloadVideos && (
                    <Skeleton className="h-96 w-64 object-cover transition-all aspect-[3/4] rounded-md" />
                  )}
                 <video className="h-96 w-64 object-cover transition-all aspect-[3/4] rounded-md" key={index}
                  controls={false} 
                  // autoPlay
                  preload="metadata"
                  onMouseOver={event => (event.target as HTMLMediaElement).play()}
                  onMouseOut={event => (event.target as HTMLMediaElement).pause()}
                  muted
                  >
                    <source src={videoUrl} />
                  </video>
                  </div>
                ))}

              {/* {videos.map((videoUrl, index) => (
                <div key={index}>
                  {loadingStates[index] && (
                    <div className="h-96 w-64  transition-all aspect-[3/4] rounded-md">
                      <Loader />
                    </div>
                  )}
                  <video
                    className={`h-96 w-64 object-cover transition-all aspect-[3/4] rounded-md ${
                      loadingStates[index] ? 'hidden' : 'block'
                    }`}
                    controls={false}
                    onMouseOver={event => (event.target as HTMLMediaElement).play()}
                    onMouseOut={event => (event.target as HTMLMediaElement).pause()}
                    muted
                    onLoadedData={() => handleLoadedData(index)}
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                </div>
              ))} */}

            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;