"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import Tus from '@uppy/tus';
import { Search, Videotape } from 'lucide-react';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { toast } from 'sonner';


const api_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZHRyeHRtaHd4d255d3NwZnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwMjM0NzksImV4cCI6MjAxOTU5OTQ3OX0.hTwPwcu50pbBDZIod4hz029-2cA5rCDzw_ZYSGclNMA';
const project_id = 'modtrxtmhwxwnywspfuf';


const VideoPage = () => {
  const [videos, setVideos] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoading2, setIsLoading2] = useState<boolean>(false);
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [reloadVideos, setReloadVideos] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
  const [searchText, setSearchText] = useState('');
  const [pexelsVideos, setPexelsVideos] = useState<any[]>([]);
  const [videosToSave, setVideosToSave] = useState<Set<any>>(new Set());
  const [open, setOpen] = React.useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    const response = await axios.get(`/api/search-library-content?search_query=${searchText}&page=1`);
    console.log(searchText)
    setPexelsVideos(response.data);
    setIsLoading(false)
  };

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

  const handleVideoToSave = (url: string, index: number) => {
    const videoSet = new Set(videosToSave);
    if (videoSet.has(url)) {
      videoSet.delete(url);
    } else {
      videoSet.add(url);
    }
    setVideosToSave(videoSet);
  };

  const submitVideosToSave = async () => {

    setIsLoading2(true);
    const videoUrls = Array.from(videosToSave);
  
    await axios.post(`/api/save-library-content`, {
      video_urls: videoUrls,
    })
    .then(() => {
      setReloadVideos(true);
      axios.get(`/api/get-content`)
      .then((response3) => {
        setVideos(response3.data.all_videos);
        toast("You've grown your content bank!", {
          description: "The selected videos have been added to your content bank.",
        })
        setLoadingStates(new Array(response3.data.length).fill(true));
        setReloadVideos(false);
        setUploaded(false);
        setVideosToSave(new Set());
        setOpen(false)
        setIsLoading2(false);
      });
    }).catch((error) => {
      toast("Failed do add videos!", {
        description: "There was an error adding to the content bank. Please try again",
      })
      setIsLoading2(false);
    })

  };

  return (
    <div>
      {/* <link href="node_modules/@uppy/core/dist/style.css" rel="stylesheet"></link> */}
      {/* <link href="https://transloadit.edgly.net/releases/uppy/v0.29.1/dist/uppy.min.css" rel="stylesheet"></link> */}
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
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircledIcon className="mr-2 h-4 w-4" />
                      Add new videos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="justify-center max-w-fit">
                    <DialogHeader>
                      <DialogTitle>Add a new video</DialogTitle>
                      <DialogDescription>
                        Search in the library or upload your own.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex">
                    <Tabs defaultValue="library" className="">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="library">Library</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                      </TabsList>
                      <TabsContent value="library" className='lg:w-[60rem] w-[40rem] h-[39rem]'>
                        <Card>
                          {/* <CardHeader>
                            <CardTitle>Lib</CardTitle>
                            <CardDescription>
                              Make changes to your account here. Click save when you're done.
                            </CardDescription>
                          </CardHeader> */}
                          <CardContent className="pt-6">
                          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                            <Input 
                                  type="text" 
                                  placeholder="Search videos" 
                                  value={searchText}
                                  onChange={(e) => setSearchText(e.target.value)}/>
                            {isLoading ? (
                                <Button type="submit"><Loader size={20} className="animate-spin"/></Button>
                            ) : (
                                <Button type="submit"><Search size={20}/></Button>
                            )}
                          </form>
                          {pexelsVideos.length === 0 && !isLoading && (
                                <div className='justify-center text-center py-56 text-sm text-muted-foreground'>Uh... you've got to search for something...</div>
                              )}
                          { isLoading && (
                            <ScrollArea className='h-[30rem] pt-4 '>
                            <div className="grid 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-fit overflow-y-auto">
                                {Array(20).fill(0).map((_, index) => (
                                  <Skeleton 
                                    key={index}
                                    className="h-64 w-44  rounded-md" 
                                  />
                                ))}
                                </div>
                                </ScrollArea>
                              )}
                           {pexelsVideos.length !== 0 && !isLoading && (
                            <ScrollArea className='h-[30rem] pt-4 '>
                            <div className="grid 2xl:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-fit overflow-y-auto">
                            {pexelsVideos.map((video: { id: number, url: string }, index: number) => (
                              <div key={video.id} className={`${videosToSave.has(video.url) ? 'border-primary border-2 rounded-lg' : ''}`}>

                                <video 
                                  className="h-64 w-44 object-cover transition-all aspect-[3/4] rounded-md cursor-pointer" 
                                  controls={true} 
                                  // autoPlay
                                  preload="auto"
                                  // onMouseOver={event => (event.target as HTMLMediaElement).play()}
                                  // onMouseOut={event => (event.target as HTMLMediaElement).pause()}
                                  muted
                                  onClick={() => handleVideoToSave(video.url, video.id)}
                                >
                                  <source src={video.url} />
                                </video>
                              </div>
                            ))}
                            </div>
                            </ScrollArea>
                            )}
                            {pexelsVideos.length !== 0 && !isLoading && (
                            <div className='mt-4 flex justify-end'>
                                {isLoading2 ? (
                                    <Button type="submit">Add to content bank<Loader size={20} className="animate-spin ml-2"/></Button>
                                ) : (
                                    <Button disabled={videosToSave.values().next().value === undefined} type="submit" onClick={submitVideosToSave}>Add to content bank</Button>
                                )}
                            </div>
                            )}
                          </CardContent>
                          {/* <CardFooter>
                            <Button>Save changes</Button>
                          </CardFooter> */}
                        </Card>
                      </TabsContent>
                      <TabsContent value="upload" className=''>
                        <Card className=' justify-center'>
                        {uppy && (
                        <Dashboard
                          uppy={uppy}
                          plugins={['Dashboard']}
                          closeAfterFinish={false}
                          note={'Videos longer than 3 seconds only, up to 30 MB'}
                          className=""
                        />
                      )}
                        </Card>
                      </TabsContent>
                    </Tabs>
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
                  controls={true}
                  typeof='video/webm' 
                  // autoPlay
                  preload="metadata"
                  // onMouseOver={event => (event.target as HTMLMediaElement).play()}
                  // onMouseOut={event => (event.target as HTMLMediaElement).pause()}
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