"use client";

import * as z from "zod";
import axios from "axios";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronRight, ChevronsUpDown, Clapperboard, Send, Undo2, RotateCw, Disc3, Info } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader } from "@/components/loader";

import { useProModal } from "@/hooks/use-pro-modal";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  ReadCaptionProps,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../../../lambda/types/constants";

import { Main } from "../../../../remotion/MyComp/Main";
import { ReadCaption } from "../../../../remotion/read-caption/Main";

import { Player } from "@remotion/player";
import { RenderControls } from "@/components/RenderControls";

import { useMediaQuery } from 'react-responsive';
import { BulletList } from "@/remotion/bullet-list/Main";
import Stepper from "@/components/ui/stepper";
import { Card } from "@/components/ui/card";
import { PostHistory } from "@/components/post-history";
import { CaptionPlayground } from "@/components/caption-playground";
import { Badge } from "@/components/ui/badge";
import { Slides } from "@/remotion/slides/Main";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Universal } from "@/remotion/universal/Main";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from 'next/image';

const caption_templates = [
  { label: "Topic Based", value: "topic" },
  { label: "Story", value: "story" },
  { label: "Bullet List", value: "bullet" }
] as const


const FormSchema = z.object({
  personal_insights: z.string({
    required_error: "Please write some personal insights.",
  }),
  call_to_action: z.string({
    required_error: "Please write a call to action for the video.",
  }),
  target_audience: z.string({
    required_error: "Please indicate the target audience.",
  }),
  video_topic: z.string({
    required_error: "Please write a video topic.",
  }),
})

const FormSchema2 = z.object({
  hook: z.string({
    required_error: "Please select a hook for the video.",
  })
})

const FormSchema3 = z.object({
  //video_template: z.string({
  //  required_error: "Please select a template for the video.",
  //}),
  caption_template: z.string({
    required_error: "Please select a template for the caption.",
  }),
  //video_source: z.string({
  //  required_error: "Please select a source for the video.",
  //})
})

const MAX_SELECTABLE_VIDEOS = 8;

const ContentGenerator = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [generated_caption, setGeneratedCaption] = useState<string>();
  const [video_topic, setVideoTopic] = useState<string>();
  const [target_audience, setTargetAudience] = useState<string>();
  const [video_template, setVideoTemplate] = useState<string>();
  const [caption_template, setCaptionTemplate] = useState<string>();
  const [video_hook, setVideoHook] = useState<string>();
  const [personal_insights, setPersonalInsights] = useState<string>();
  const [call_to_action, setCallToAction] = useState<string>();
  // const [video_link, setVideoLink] = useState<any>();
  // const [selectedValue, setSelectedValue] = useState<string>();
  const [hookOptions, setHookOptions] = useState<any>();
  const [generalProps, setGeneralProps] = useState<any>({
    // ... other properties
    video: [], // Initialize as an empty array
  });
  const [selectedCaption, setSelectedCaption] = useState<any>();
  // const [componentId, setComponentId] = useState<any>();
  const [videos, setVideos] = useState<{ [key: string]: string }>({});
  type VideoObject = { video: string };
  const [fullVideoList, setFullVideoList] = useState<string[]>([]);
  // const [texts, setTexts] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading3, setLoading3] = useState(false);

  const [postHistoryOut, setPostHistoryOut] = useState<any>(null);
  const [comingFromPlanner, setComingFromPlanner] = useState(false);

  const [selectedVideos, setSelectedVideos] = useState<string[]>([])

  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const [trackUrl, setTrackUrl] = useState<string>('');

  const [showNoVideosDialog, setShowNoVideosDialog] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const form2 = useForm<z.infer<typeof FormSchema2>>({
    resolver: zodResolver(FormSchema2),
  })

  const form3 = useForm<z.infer<typeof FormSchema3>>({
    resolver: zodResolver(FormSchema3),
  })

  let isLoading1 = form2.formState.isSubmitting;
  let isLoading2 = form.formState.isSubmitting;
  let isLoading3 = form3.formState.isSubmitting;
  let hasGeneratedHooks = false;

  const searchParams = useSearchParams()

  useEffect(() => {
    const id = searchParams.get('id')
    const topic = searchParams.get('topic')
    const hook = searchParams.get('hook')
    const cta = searchParams.get('cta')
    const target_audience = searchParams.get('target_audience')
    const personal_insights = searchParams.get('personal_insights')

    if (id && topic && hook) {
      setCurrentStep(3)
      setVideoTopic(topic)
      setVideoHook(hook || '')
      setCallToAction(cta || '')
      setTargetAudience(target_audience || '')
      setPersonalInsights(personal_insights || '')
      setGeneratedCaption(undefined)
      setComingFromPlanner(true)
    }
  }, [searchParams])

  useEffect(() => {
    const totalDuration = 6 * 30; // 6 seconds at 30 fps
    const firstVideoDuration = 3 * 30; // 3 seconds at 30 fps

    const videoSequences = selectedVideos.map((video, index) => {
      if (index === 0) {
        // First video stays for 3 seconds
        return {
          video,
          startFrame: 0,
          durationInFrames: firstVideoDuration
        };
      } else {
        // Calculate duration for remaining videos
        const remainingVideos = selectedVideos.length - 1;
        const remainingDuration = totalDuration - firstVideoDuration;
        const durationPerVideo = Math.floor(remainingDuration / remainingVideos);
        const startFrame = firstVideoDuration + (index - 1) * durationPerVideo;

        return {
          video,
          startFrame,
          durationInFrames: durationPerVideo
        };
      }
    });

    const textSequences = [
      {
        id: 'hook',
        type: 'text' as const,
        content: video_hook,
        start: 0,
        duration: 6, // Show text for full 6 seconds
        x: 0,
        y: 0,
        font: "Montserrat",
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
      // Add more text sequences as needed
    ];

    const genProps = {
      videoSequences,
      textSequences,
      title: video_hook,
      readCap: "Read Caption ↓",
      video: selectedVideos,
      selectedFont: "Montserrat"
    };

    setGeneralProps(genProps);
  }, [selectedVideos, video_hook]); // Add any other dependencies that should trigger this effect

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoadingVideos(true);
      try {
        const response = await axios.get('/api/get-content');
        setFullVideoList(response.data.all_videos);
        if (response.data.all_videos.length === 0) {
          setShowNoVideosDialog(true);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        toast.error('Failed to load videos from content bank. Please try again.');
      } finally {
        setIsLoadingVideos(false);
      }
    };

    fetchVideos();
  }, []);

  const generateVideoCaption = async (values: z.infer<typeof FormSchema3>) => {
    try {
      isLoading3 = true;

      // Prepare both requests
      const templateRequest = axios.get(`/api/get-video-template?count=${selectedVideos.length}`);
      const body = {
        hook: video_hook,
        target_audience: target_audience,
        caption_template: values.caption_template,
        video_topic: video_topic,
        call_to_action: call_to_action,
        personal_insights: personal_insights
      };
      const captionRequest = axios.post(`/api/get-caption`, body);

      // Make both requests concurrently
      const [templateResponse, captionResponse] = await Promise.all([templateRequest, captionRequest]);

      

      const videoTemplate = templateResponse.data.template;

      setTrackUrl(videoTemplate.track_url)

      if (!videoTemplate) {
        toast.error("Failed to get a video template. Please try again.");
        return;
      }

      const videoSequences = videoTemplate.sequences.map((seq: any, index: number) => ({
        ...seq,
        video: selectedVideos[index] || selectedVideos[selectedVideos.length - 1] // Use last video if we run out
      }));

      const textSequences = [
        {
          id: 'hook',
          type: 'text' as const,
          content: video_hook,
          start: 0,
          duration: 6, // Show text for full 6 seconds
          x: 0,
          y: 0,
          font: "Montserrat",
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.5)'
        },
        // Add more text sequences as needed
      ];

      setGeneralProps({
        videoSequences,
        textSequences,
        title: video_hook,
        readCap: "Read Caption ↓",
        video: selectedVideos,
        selectedFont: "Montserrat"
      });

      console.log('Selected video template:', videoTemplate.value);

      setGeneratedCaption(captionResponse.data);
      setPostHistoryOut(null);

      setHookOptions(undefined);
      form.reset();
      form2.reset();
      setComingFromPlanner(false);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setCurrentStep(1);
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      isLoading3 = false;
      router.refresh();
    }
  };

  const getTemplates = async (values: z.infer<typeof FormSchema2>) => {
    try {

      setVideoHook(values.hook)

      setCurrentStep(3);


    } catch (error: any) {
      if (error?.response?.status === 403) {
        setCurrentStep(1);
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

  const generateHook = async (values: z.infer<typeof FormSchema>) => {
    try {
      console.log(values)
      console.log(currentStep)
      setCurrentStep(2);

      hasGeneratedHooks = true;
      console.log(values)

      isLoading2 = true;
      setPersonalInsights(values.personal_insights)
      setCallToAction(values.call_to_action)
      setTargetAudience(values.target_audience)

      const response = await axios.post(`/api/get-hook`, values);

      setHookOptions(response.data);

      // setVideoTemplate(values.video_template)
      setVideoTopic(values.video_topic)

      isLoading2 = false;

    } catch (error: any) {
      if (error?.response?.status === 403) {
        setCurrentStep(1);
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }


  const reGenerateHook = async () => {
    try {
   
      setLoading3(true);

      const values = {
        target_audience: target_audience,
        video_topic: video_topic,
        call_to_action: call_to_action,
        personal_insights: personal_insights
      }

      const response = await axios.post(`/api/get-hook`, values);

      setHookOptions(response.data);

      setLoading3(false);

    } catch (error: any) {
      if (error?.response?.status === 403) {
        setCurrentStep(1);
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }
  // const handleChange = (value: SetStateAction<string | undefined>) => {
  //   setSelectedValue(value);
  // };


  const returnButton = async () => {
    try {
      setCurrentStep(1);
      setGeneratedCaption(undefined);
      setVideoTemplate(undefined)
      setCaptionTemplate(undefined)
      setVideoTopic(undefined)
      setHookOptions(undefined);
      setTargetAudience(undefined)
      setComingFromPlanner(false)

      form.reset();
      form2.reset();
      form3.reset();

      isLoading1 = false;
      isLoading2 = false;
      isLoading3 = false;

    } catch (error: any) {
      if (error?.response?.status === 403) {
        setCurrentStep(1);
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }

  // const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
  //   return {
  //     title: video_hook || "Default Hook",
  //     video: videos.video1 || "Default video",
  //   };
  // }, [video_hook, videos.video1]);

  const readCaptionProps: z.infer<typeof ReadCaptionProps> = useMemo(() => {
    return {
      title: video_hook || "Default Hook",
      video1: videos.video1 || "Default video",
      video2: videos.video2 || "Default video",
      readCap: "Read Caption ↓",
      selectedFont: "Montserrat"
    };
  }, [video_hook,  videos.video1,  videos.video2]);

  const video_templates = [
    { label: "Read caption", value: 'read-caption', description:`Clear call-to-action for your viewer to read your caption.`, url: 'https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/templates/read-caption.mp4?t=2024-04-13T16%3A36%3A01.379Z' },
    // { label: "Read Caption", value: 'readCaptionProps' },
    { label: "Single clip with hook", value: 'no-cta', description:`Unedited video showing your hook. Lets your viewer naturally check the caption.`, url: 'https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/templates/no-cta.mp4?t=2024-04-13T16%3A17%3A07.380Z' },
    // { label: "Slides", value: 'slides', description:`Edited video showing information over multiple clips. Similar to a slideshow.`, url: 'https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/templates/no-cta.mp4?t=2024-04-13T16%3A17%3A07.380Z' },
    // { label: "Read Caption Fast Edit", value: 'slides', description:`Clear call-to-action for your viewer to read your caption, with fast editing of multiple clips.`, url: 'https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/templates/no-cta.mp4?t=2024-04-13T16%3A17%3A07.380Z' },
  ] as const

  const caption_templates = [
    { label: "How To", value: 'How To', description: 'Instructional caption on how to do something.' },
    // { label: "Read Caption", value: 'readCaptionProps' },
    { label: "Story", value: 'Story', description: 'Longer caption that tells a story about your experience.' },
    { label: "Bullet List", value: "Bullet List", description: 'Concise caption with bullet points about your topic.' },
  ] as const

  const video_sources = [
    { label: "Library", value: 'library', description: 'Clips from a library of creators picked specifically for your video topic.' },
    // { label: "Read Caption", value: 'readCaptionProps' },
    { label: "Content Bank", value: 'bank', description: 'Your saved or uploaded clips. If your content bank is empty, the Library will be used.' },
  ] as const

  const returnFunction = () => {
    setCurrentStep(1)
  }

  const handleVideoSelection = (video: string) => {
    setSelectedVideos(prev => {
      if (prev.includes(video)) {
        return prev.filter(v => v !== video);
      } else {
        if (prev.length >= MAX_SELECTABLE_VIDEOS) {
          toast.error(`You can select a maximum of ${MAX_SELECTABLE_VIDEOS} videos.`);
          return prev;
        }
        return [...prev, video];
      }
    });
  };

  return ( 
    <div>
    <div><Heading
        title="Post Generator"
        description="Generate enganging content."
        icon={Clapperboard}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      </div>
      <div className="px-4 lg:px-8 overflow-x-hidden">
      <Separator className="mb-4" />
      <Dialog open={showNoVideosDialog} onOpenChange={setShowNoVideosDialog}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>No videos to use in post generation</DialogTitle>
          </DialogHeader>
          <p className="text-md text-gray-700">
            You don&apos;t have any videos in your content bank. Please add some before trying to generate a post.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <Image
              src="/content-bank-tutorial.png"
              alt="Content Bank Tutorial"
              width={800}
              height={400}
              className="rounded-md border-2 border-gray-200"
            />
            <p className="text-md text-gray-700">
              It&apos;s very easy! If you don&apos;t have any videos of your own to upload, you can use the Library tab to find videos that match your style.
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary" onClick={() => router.push('/content-bank')}>
              Go to Content Bank
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    
      {currentStep === 1 && (
        <div className="h-full ">
        
          <div className="flex justify-center pb-5">  
            <ul className="steps w-1/2">
              <li className="step step-primary">Topic</li>
              <li className="step ">Hook</li>
              <li className="step">Templates</li>
            </ul>
          </div>
        {/* <Card className="p-5 h-[65vh] overflow-y-auto"> */}

        <div className="h-full grid content-center">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(generateHook)} className="space-y-6">
          <FormField
                  name="video_topic"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Video Topic</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          
                          disabled={isLoading1} 
                          placeholder="E.g. How I've made 100k with Instagram." 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
            <FormField
                name="target_audience"
                render={({ field }: { field: any }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl className="w-full">
                      <Input
                        
                        disabled={isLoading1
                        } 
                        placeholder="E.g. Content creators that sell digital products in Instagram." 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
          />
          <FormField
              name="personal_insights"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Personal Insights</FormLabel>
                  <FormControl className="w-full">
                    <Textarea
                      
                      disabled={isLoading1
                      } 
                      placeholder="E.g. For me, the biggest lesson is how to market your products. For that, what I do is..." 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                   {isMobile ? null : 'Provide your audience with value from your own experience. This will make the content feel personal and increase engagement.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
          />
           <FormField
              name="call_to_action"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Call to Action</FormLabel>
                  <FormControl className="w-full">
                    <Input
                      placeholder="E.g. If you want a free guide on how to get started, comment “guide” and I’ll send it to you 🎁"
                      disabled={isLoading1
                      } 
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                  {isMobile ? null : 'What do you want your audience to do?'}
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
          />
          {/* <FormField
            control={form.control}
            name="video_template"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Caption Template</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          `justify-between ${isMobile ? 'w-full' : 'w-1/4'}`,
                          !field.value && "text-muted-foreground"
                        )}
                        
                      >
                        {field.value
                          ? video_templates.find(
                              (video_template) => video_template.value === field.value
                            )?.label
                          : "Select template"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className={` ${isMobile ? '' : ''}`}>Re
                    <Command>
                      <CommandInput placeholder="Search caption templates..." />
                      <CommandEmpty>No video template found.</CommandEmpty>
                      <CommandGroup>
                        {video_templates.map((video_template) => (
                          <CommandItem
                            value={video_template.label}
                            key={video_template.value}
                            onSelect={() => {
                              form.setValue("video_template", video_template.value)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                video_template.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {video_template.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
    
                <FormMessage />
              </FormItem>
            
            )}
          /> */}
        
          <div className="flex justify-end">
             <Button type="submit">
               <span className="">Generate Hook</span>
               <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
          </div>

          {/* {target_audience && !isLoading2 && (
          <Button type="submit" variant="secondary">
               <span className="">Re-generate Hook</span>
               <RotateCw className="h-4 w-4 ml-2" />
               </Button>
          )} */}
          {/* {target_audience && isLoading2 && (
          <Button type="submit" variant="secondary">
               <span className="text-slate-300">Re-generate Hook</span>
                <RotateCw color="#e21d48" size={16} className="animate-spin ml-2" />
               </Button>
          )} */}
        </form>
      </Form>
      </div>
      {/* <div className="flex justify-end">
        <Button onClick={returnButton} >
          <span className="">Next</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div> */}
      {/* </Card> */}
      </div>
      )}
      { currentStep === 2 && (
        <div className="h-full overflow-x-hidden">
        <div className="flex justify-center pb-5 ">  
          <ul className="steps w-1/2">
            <li className="step step-primary">Topic</li>
            <li className="step step-primary">Hook</li>
            <li className="step">Templates</li>
          </ul>
        </div>
      {/* <Card className="p-5 h-[65vh]"> */}
      <h2 className="text-xl font-medium pb-10">Choose a hook</h2>
        { isLoading2 && (
          <div className="p-20">
            <Loader />
          </div>
        )}
         
        {video_topic && target_audience && !isLoading2  && !isLoading1 && (
          <div className="h-full grid content-center">
             <div className="flex justify-start">
            {/* {target_audience && !loading3 && (
              <Button onClick={reGenerateHook} variant="secondary">
                   <span className="">Re-generate Hooks</span>
                   <RotateCw className="h-4 w-4 ml-2" />
                   </Button>
              )}
              {target_audience && loading3 && (
              <Button onClick={reGenerateHook} variant="secondary">
                   <span className="text-slate-300">Re-generate Hooks</span>
                    <RotateCw color="#e21d48" size={16} className="animate-spin ml-2" />
                   </Button>
              )} */}
          </div>
        <div className="">
        <Form {...form2}>
          <form onSubmit={form2.handleSubmit(getTemplates)}>
          <FormField
            control={form2.control}
            name="hook"
            render={({ field }: { field: any }) => (
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className={`flex flex-col space-y-1 ${isMobile ? 'mr-2' : ''}`}>
          <div  className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {Object.entries(hookOptions).map(([key, label], index)  => (
              <Card key={index} className={`  ${field.value === label ? 'p-5 bg-secondary' : 'p-5'}`}>
              <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
              <FormControl>
                <RadioGroupItem value={label as string}/>
              </FormControl>
              <FormLabel className="font-normal">
                {label as string}
              </FormLabel>
              </FormItem>
              </Card>
            ))}
          </div>
          </RadioGroup>
            )}
          />
          <div className="pt-10 flex justify-end pb-4">

          <Button type="submit">
              <span className="">Pick the template</span>
              <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
          </div>
        </form>
        </Form>
        </div>
        </div>
        )}
        {/* </Card> */}
        </div>
      )}
      {currentStep === 3 && !generated_caption && (
       <div> <div>{!comingFromPlanner && (
          <div className="h-full">
            <div className="flex justify-center pb-5">  
              <ul className="steps w-1/2">
                <li className="step step-primary">Topic</li>
                <li className="step step-primary">Hook</li>
                <li className="step step-primary">Templates</li>
              </ul>
            </div>
          </div>
        )}</div>
       {/* <Card className="p-5 h-[65vh]"> */}
         { isLoading2 && (
           <div className="p-20">
             <Loader />
           </div>
         )}
        {video_topic && target_audience && !isLoading2  && !isLoading1 && (
          <div className="h-full grid content-center">
             <div className="flex justify-start">
            {/* {target_audience && !loading3 && (
              <Button onClick={reGenerateHook} variant="secondary">
                   <span className="">Re-generate Hooks</span>
                   <RotateCw className="h-4 w-4 ml-2" />
                   </Button>
              )}
              {target_audience && loading3 && (
              <Button onClick={reGenerateHook} variant="secondary">
                   <span className="text-slate-300">Re-generate Hooks</span>
                    <RotateCw color="#e21d48" size={16} className="animate-spin ml-2" />
                   </Button>
              )} */}
          </div>
        <div className="">
        <div>
      <h2 className="text-xl font-medium pb-4 pt-6">Select videos for your post (max {MAX_SELECTABLE_VIDEOS})</h2>
      {isLoadingVideos ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex overflow-x-auto mx-2">
            {fullVideoList.length > 0 ? (
              fullVideoList.map((video, index) => (
                <div key={index} className="relative flex-shrink-0 mx-1 my-2">
                  <video
                    className={`h-64 w-42 object-cover transition-all hover:scale-95 aspect-[3/4] rounded-md border-2 ${
                      selectedVideos.includes(video) ? 'border-primary' : 'border-transparent'
                    } cursor-pointer ${selectedVideos.length >= MAX_SELECTABLE_VIDEOS && !selectedVideos.includes(video) ? 'opacity-50' : ''}`}
                    controls={true}
                    muted
                    autoPlay={false}
                    onClick={() => handleVideoSelection(video)}
                  >
                    <source src={video} />
                  </video>
                  {selectedVideos.includes(video) && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                      {selectedVideos.indexOf(video) + 1}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center w-full py-8">
                No videos available in your content bank. Please add some videos first.
              </p>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
        <Form {...form3}>
          <form onSubmit={form3.handleSubmit(generateVideoCaption)}>
          {/* <h2 className="text-xl font-medium pb-2 pt-5">Choose the source for the video content</h2>
          <FormField
            control={form3.control}
            name="video_source"
            render={({ field }: { field: any }) => (
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}  className="flex flex-col space-y-1">
          <div className={`grid content-center gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2  '}`}>
            {Object.entries(video_sources).map(([key, label], index)  => (
              <Card key={index} className={`cursor-pointer ${field.value === label.label ? 'p-5 bg-secondary' : 'p-5'}`}>
              <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
              <FormControl>
                <RadioGroupItem value={label.label as string}/>
              </FormControl>
              <FormLabel className="font-normal cursor-pointer flex gap-4">
             
                
                  <div>
                    <h2 className="text-lg font-medium pb-2">{label.label as string}
                    </h2>
                    <span className="text-sm text-stone-500 dark:text-stone-400">{label.description as string}</span>
                  </div>
             
              </FormLabel>
              </FormItem>
              </Card>
              
            ))}
          </div>
          </RadioGroup>
            )}
          />*/}
          <h2 className="text-xl font-medium pb-4 pt-8">Choose a caption template</h2>
          <FormField
            control={form3.control}
            name="caption_template"
            render={({ field }: { field: any }) => (
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}  className="flex flex-col space-y-1">
          <div  className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {Object.entries(caption_templates).map(([key, label], index)  => (
              <Card key={index} className={`cursor-pointer ${field.value === label.label ? 'p-5 bg-secondary' : 'p-5'}`}>
              <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
              <FormControl>
                <RadioGroupItem value={label.label as string}/>
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                <h2 className="text-lg font-medium pb-2">{label.label as string}</h2>
                <span>{label.description as string}</span>
              </FormLabel>
              </FormItem>
              </Card>
              
            ))}
          </div>
          </RadioGroup>
            )}
          />
          {/* Video template selection 
          <div>
          <h2 className="text-xl font-medium pb-2 pt-6">Choose a video template</h2>
          <FormField
            control={form3.control}
            name="video_template"
            render={({ field }: { field: any }) => (
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}  className="flex flex-col space-y-1">
          <div className={`grid content-center gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2  '}`}>
            {Object.entries(video_templates).map(([key, label], index)  => (
              <Card key={index} className={`cursor-pointer ${field.value === label.label ? 'p-5 bg-secondary' : 'p-5'}`}>
              <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
              <FormControl>
                <RadioGroupItem value={label.label as string}/>
              </FormControl>
              <FormLabel className="font-normal cursor-pointer flex gap-4">
              
                
                  <div>
                    <h2 className="text-lg font-medium pb-2">{label.label as string}
                    </h2>
                    <span className="text-sm text-stone-500 dark:text-stone-400">{label.description as string}</span>
                  </div>
             
              </FormLabel>
              </FormItem>
              </Card>
              
            ))}
          </div>
          </RadioGroup>
            )}
          />
          
          </div>
          */}
          <div className=" flex justify-end pt-10 pb-16">

          { isLoading3 && (
          <Button type="submit">
               <span className="">Generate Post</span>
               <RotateCw size={16} className="animate-spin ml-2" />
               </Button>
          )}
        { !isLoading3 && (
          <Button type="submit">
              <span className="">Generate Post</span>
              <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              )}
          </div>
        </form>
        </Form>
        </div>
        </div>
        )}
        </div>
      )}
        {generated_caption && generalProps && (
          <div className={`flex space-y-4 mt-10 ${isMobile ? 'h-screen' : 'flex-col '}`} >
            <div className={`${isMobile ? 'h-screen' : ' grid gap-6 lg:grid-cols-3 lg:grid-rows-1'}`}>
            {/* {isMobile && ( <Button variant="secondary" onClick={returnButton} className="mb-5">
               <Undo2 className="h-4 w-4 mr-1" />
               <span className="">Return</span>
             </Button>)} */}
           <div className="col-span-1">
            <Button variant="secondary" onClick={returnButton} className="mb-5">
               <Undo2 className="h-4 w-4 mr-1" />
               <span className="">Return</span>
             </Button>
             {fullVideoList.length >= 1 && (<div><h1 className="mb-5">Video Options</h1>
             <RenderControls
              setInputProps={setGeneralProps}
              inputProps={generalProps}
              videos={fullVideoList}
              video_template={video_template}
            ></RenderControls></div>)}
           </div>
           {isLoading1 && (
              <div className="p-20">
                <Loader />
              </div>
            )}
           {/* {!isMobile && (<div className="flex text-center text-gray-900 mb-5 text-sm">Please access on Desktop to generate and download videos.</div>)} */}
            <div className=" flex justify-center col-span-1 h-[78vh]">
                {/* {(video_template === "inputProps") && (  <Player
                    component={Main}
                    inputProps={generalProps}
                    durationInFrames={DURATION_IN_FRAMES}
                    fps={VIDEO_FPS}
                    compositionHeight={VIDEO_HEIGHT}
                    compositionWidth={VIDEO_WIDTH}
                    controls
                    autoPlay
                    style={{ height: "100%" }}
                    loop
                  />)} */}
                {/* {(video_template === "readCaptionProps") && (  <Player
                  component={ReadCaption}
                  inputProps={generalProps}
                  durationInFrames={DURATION_IN_FRAMES}
                  fps={VIDEO_FPS}
                  compositionHeight={VIDEO_HEIGHT}
                  compositionWidth={VIDEO_WIDTH}
                  controls
                  autoPlay
                  style={{ height: "100%" }}
                  loop
                />)} */}
             {fullVideoList.length < 1 && 
            (<div className="grid content-center text-center space-x-4 p-4"> 
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  To generate videos, first add at least two videos in your content bank.
                </p>

              </div>)}
          
            {fullVideoList.length >= 1 && (
                <Player
                  component={Universal}
                  inputProps={generalProps}
                  durationInFrames={6 * 30} // Always 6 seconds at 30 fps
                  fps={VIDEO_FPS}
                  compositionHeight={VIDEO_HEIGHT}
                  compositionWidth={VIDEO_WIDTH}
                  controls
                  autoPlay
                  style={{ height: "100%" }}
                  className="h-screen object-cover transition-all rounded-md"
                  loop
                />
              )}
              {/* <video className="h-screen  object-cover transition-all aspect-[3/4] rounded-md" 
                  controls={false} 
                  autoPlay
                  muted
                  loop>
                    <source src="https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/user_2aPY12uVo8oyqxKieBV7qpNOgOJ/IMG_2199.mp4" type="video/mp4" />
                  </video> */}
              </div>
              {isMobile && (<div className="mb-1 ml-2 pt-5">Generated Caption:</div>)}
              <div>
              <Card className="mb-2 bg-secondary h-[4vh] flex items-center ">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    
                    <Button variant="token">
                    <Disc3 className="h-4 w-4 mr-2"/>
                    <Link href={trackUrl} target="_blank" rel="noopener noreferrer">
                      <span className="text-sm">Use this trending audio</span>
                      </Link>
                      </Button>
                   
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="token">
                        <Info className="h-4 w-4"/>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Disclaimer</DialogTitle>
                        </DialogHeader>
                          By clicking the &quot;Use this trending audio&quot; button, you will be redirected to Instagram&apos;s platform. Our app does not host, control, or assume responsibility for the content, including any audio, available on Instagram. Please ensure that you comply with Instagram&apos;s Terms of Use and copyright rules when using audio from their platform. Any legal or copyright issues related to the use of this audio are the sole responsibility of the user. Our app is independent of Instagram and is not affiliated with or endorsed by Instagram in any way.
                    </DialogContent>
                  </Dialog>
                </div>
             </Card>
             <Textarea
               placeholder="You erased the whole caption!"
               className={`${isMobile ? 'overflow-y-auto h-full' : 'col-span-1  h-[74vh]'}`}
               defaultValue={generated_caption}
             />
            
           </div>
           </div>
         </div>
        )}
      </div>
    </div>
   );
}
 
export default ContentGenerator;