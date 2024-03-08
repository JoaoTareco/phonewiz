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

const VideoPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [videos, setVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File>()


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/get-content`);
        setVideos(response.data.map((item: any) => item.video));
      } catch (error) {
        console.error('API Error:', error);
      } finally{
        setIsLoading(false)
      }
    };

    fetchData();
  }, []);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!file) return

    try {
      setUploading(true)
      const data = new FormData()
      data.set('file', file)

      const res = await fetch('/api/add-content', {
        method: 'POST',
        body: data
      })

      setUploading(false)

      const response = await axios.get(`/api/get-content`);
      setVideos(response.data.map((item: any) => item.video));
      // handle the error
      if (!res.ok) throw new Error(await res.text())
    } catch (e: any) {
      // Handle errors here
      console.error(e)
    }
  }

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
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Video</DialogTitle>
                      <DialogDescription>
                        Please make sure it is longer than 3 seconds.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="url">Video</Label>
                        <Input type="file" name="file" onChange={(e) => setFile(e.target.files?.[0])}/>
                      </div>
                    </div>
                    <DialogFooter>
                     <DialogClose asChild>
                      {!uploading && (<Button onClick={(e) => handleFileUpload(e as unknown as React.ChangeEvent<HTMLInputElement>)}>Upload Video</Button>)}
                      </DialogClose>
                    </DialogFooter>
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
        </div>
      </div>
      {uploading && (
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
      </div>)}
    </div>
   );
}
 
export default VideoPage;
