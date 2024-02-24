"use client";

import * as z from "zod";
import axios from "axios";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronsUpDown, Clapperboard, Send, Undo2, RotateCw } from "lucide-react";

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

const caption_templates = [
  { label: "Topic Based", value: "topic" },
  { label: "Story", value: "story" },
  { label: "Bullet List", value: "bullet" }
] as const


const FormSchema = z.object({
  video_template: z.string({
    required_error: "Please select a template for the video.",
  }),
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

const ContentGenerator = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [generated_caption, setGeneratedCaption] = useState<string>();
  const [video_topic, setVideoTopic] = useState<string>();
  const [target_audience, setTargetAudience] = useState<string>();
  const [video_template, setVideoTemplate] = useState<string>();
  const [caption_template, setCaptionTemplate] = useState<string>();
  const [video_hook, setVideoHook] = useState<string>();
  const [video_link, setVideoLink] = useState<any>();
  const [selectedValue, setSelectedValue] = useState<string>();
  const [hookOptions, setHookOptions] = useState<any>();
  const [generalProps, setGeneralProps] = useState<any>();
  const [componentId, setComponentId] = useState<any>();
  const [videos, setVideos] = useState<{ [key: string]: string }>({});
  const [fullVideoList, setfullVideoList] = useState<{ [key: string]: string }>({});
  const [texts, setTexts] = useState<{ [key: string]: string }>({});

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const form2 = useForm<z.infer<typeof FormSchema2>>({
    resolver: zodResolver(FormSchema2),
  })

  let isLoading1 = form2.formState.isSubmitting;
  let isLoading2 = form.formState.isSubmitting;
  let hasGeneratedHooks = false;

  useEffect(() => {
    let genProps = {};

    if (video_template === 'inputProps') {
      genProps = {
        title: video_hook,
        video: videos.video1 // Assuming videos.video1 is the correct video URL
      };
    } else if (video_template === 'readCaptionProps') {
      genProps = {
        title: video_hook,
        video1: videos.video1, // Assuming videos.video1 and videos.video2 are the correct video URLs
        video2: videos.video2
      };
    }

    setGeneralProps(genProps);
  }, [videos, video_template,video_hook]); // Specify the correct dependencies

  const generateVideoCaption = async (values: z.infer<typeof FormSchema2>) => {
    try {

      setVideoHook(values.hook)

      let genProps = {};
  
      if (video_template === 'inputProps') {
        genProps = inputProps;
      } else if (video_template === 'readCaptionProps') {
        genProps = readCaptionProps;
      }
    
      axios.get(`/api/get-content`).then((response1: { data: any; }) => {
          const videos = response1.data;

          setfullVideoList(videos)
      
          const videoCount: number = Object.keys(genProps).filter((key) => key.startsWith('video')).length;
      
          console.log(videoCount);
      
          for (let i = 0; i < videoCount; i++) {
            const videoName = `video${i + 1}`;
            const randomIndex = Math.floor(Math.random() * videos.length); // Generate a random index
            const randomVideo = videos[randomIndex]; // Access the video at the random index
            console.log('here3');
            setVideos((prevState: any) => ({ ...prevState, [videoName]: randomVideo.video }));
          }

      })

      // setVideoLink(randomVideo.video)

      isLoading1 = true;

      const body = {
        hook: values.hook,
        target_audience: target_audience,
        video_template: video_template,
        caption_template: caption_template,
        video_topic: video_topic
      }

      console.log(body)

      const response = await axios.post(`/api/get-caption`, body);


      setGeneratedCaption(response.data);

      isLoading1 = false;

      setHookOptions(undefined);
      form.reset();
      form2.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }

  const generateHook = async (values: z.infer<typeof FormSchema>) => {
    try {
      console.log(values)

      hasGeneratedHooks = true;
      console.log(values)

      isLoading2 = true;
      setTargetAudience(values.target_audience)

      const response = await axios.post(`/api/get-hook`, values);

      setHookOptions(response.data);

      setVideoTemplate(values.video_template)
      setVideoTopic(values.video_topic)

      isLoading2 = false;

    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }

  const handleChange = (value: SetStateAction<string | undefined>) => {
    setSelectedValue(value);
  };


  const returnButton = async () => {
    try {
      setGeneratedCaption(undefined);
      setVideoTemplate(undefined)
      setCaptionTemplate(undefined)
      setVideoTopic(undefined)
      setHookOptions(undefined);
      setTargetAudience(undefined)

      form.reset();
      form2.reset();

      isLoading1 = false;
      isLoading2 = false;

    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: video_hook || "Default Hook",
      video: videos.video1
    };
  }, [video_hook, videos.video1]);

  const readCaptionProps: z.infer<typeof ReadCaptionProps> = useMemo(() => {
    return {
      title: video_hook || "Default Title",
      video1: videos.video1,
      video2: videos.video2
    };
  }, [video_hook,  videos.video1,  videos.video2]);

  const video_templates = [
    { label: "Initial Demo", value: 'inputProps' },
    { label: "Read Caption", value: 'readCaptionProps' },
    { label: "Info Slides", value: "image" },
  ] as const

  return ( 
    <div>
      <Heading
        title="Post Generator"
        description="Generate enganging content."
        icon={Clapperboard}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8">
      <Separator className="my-4" />
      {!isLoading1 && !generated_caption && (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(generateHook)} className="space-y-6">
          <FormField
                  name="video_topic"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Video Topic</FormLabel>
                      <FormControl className="w-[1200px]">
                        <Input
                          
                          disabled={isLoading1} 
                          placeholder="How I've made 100k with Instagram." 
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
                    <FormControl className="w-[1200px]">
                      <Input
                        
                        disabled={isLoading1
                        } 
                        placeholder="Target audience for the video" 
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
                  <FormControl className="w-[1200px]">
                    <Textarea
                      
                      disabled={isLoading1
                      } 
                      placeholder="Write some personal insight you want to give to your audience." 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    It is a good idea to provide your audience with value from your own experience. Add a personal touch to your content to increase engagement.
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
                  <FormControl className="w-[1200px]">
                    <Input
                      placeholder="If you want a free guide on how to get started, comment “guide” and I’ll send it to you 🎁"
                      disabled={isLoading1
                      } 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What do you want your audience to do?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
          />
          <FormField
            control={form.control}
            name="video_template"
            render={({ field }: { field: any }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Video Template</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
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
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search video templates..." />
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
                {/* <FormDescription>
                  This is the language that will be used in the dashboard.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            
            )}
          />
          
          {!target_audience && !isLoading2 && (
          <Button type="submit">
               <span className="">Generate Hook</span>
               <ChevronRight className="h-4 w-4 ml-1" />
               </Button>
          )}
          {target_audience && !isLoading2 && (
          <Button type="submit" variant="secondary">
               <span className="">Re-generate Hook</span>
               <RotateCw className="h-4 w-4 ml-2" />
               </Button>
          )}
          {target_audience && isLoading2 && (
          <Button type="submit" variant="secondary">
               <span className="text-slate-300">Re-generate Hook</span>
                <RotateCw color="#e21d48" size={16} className="animate-spin ml-2" />
               </Button>
          )}
        </form>
      </Form>
      )}
        {isLoading1 && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {video_topic && target_audience && !isLoading2 && !generated_caption && !isLoading1 && (
          <div className="flex flex-col  pt-8">
          <Form {...form2}>
            <form onSubmit={form2.handleSubmit(generateVideoCaption)}>
            <FormField
              control={form2.control}
              name="hook"
              render={({ field }: { field: any }) => (
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value}  className="flex flex-col space-y-1">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(hookOptions).map(([key, label], index)  => (
                <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
                <FormControl>
                  <RadioGroupItem value={label as string}/>
                </FormControl>
                <FormLabel className="font-normal">
                  {label as string}
                </FormLabel>
                </FormItem>
              ))}
            </div>
            </RadioGroup>
              )}
            />
            <div className="pt-7">
            <Button type="submit">
               <span className="">Generate Video and Caption</span>
               <ChevronRight className="h-4 w-4 ml-1" />
               </Button>
            </div>
          </form>
          </Form>
          </div>
        )}
        {generated_caption && generalProps && (
          <div className="flex flex-col  space-y-4">
           <div className="h-[750px] grid grid-rows-2 gap-6 lg:grid-cols-3 lg:grid-rows-1">
           <div className="col-span-1">
            <Button variant="secondary" onClick={returnButton} className="mb-5">
               <Undo2 className="h-4 w-4 mr-1" />
               <span className="">Return</span>
             </Button>
             <h1 className="mb-5">Video Options</h1>
           <RenderControls
              text={video_hook}
              setText={setVideoHook}
              setInputProps={setGeneralProps}
              inputProps={generalProps}
              videos={fullVideoList}
            ></RenderControls>
           </div>
             <div className="rounded-md border bg-muted flex justify-center col-span-1">
                {(video_template === "inputProps") && (  <Player
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
                  />)}
                {(video_template === "readCaptionProps") && (  <Player
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
                />)}
              {/* <video className="h-screen  object-cover transition-all aspect-[3/4] rounded-md" 
                  controls={false} 
                  autoPlay
                  muted
                  loop>
                    <source src="https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/user_2aPY12uVo8oyqxKieBV7qpNOgOJ/IMG_2199.mp4" type="video/mp4" />
                  </video> */}
              </div>
             <Textarea
               placeholder="You erased the whole caption!"
               className="col-span-1"
               defaultValue={generated_caption}
             />
           </div>
         </div>
        )}
      </div>
    </div>
   );
}
 
export default ContentGenerator;
