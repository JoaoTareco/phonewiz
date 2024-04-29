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

import { useMediaQuery } from 'react-responsive';
import { BulletList } from "@/remotion/bullet-list/Main";
import Stepper from "@/components/ui/stepper";
import { Card } from "@/components/ui/card";

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
  video_template: z.string({
    required_error: "Please select a template for the video.",
  }),
  caption_template: z.string({
    required_error: "Please select a template for the caption.",
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
  const [personal_insights, setPersonalInsights] = useState<string>();
  const [call_to_action, setCallToAction] = useState<string>();
  // const [video_link, setVideoLink] = useState<any>();
  // const [selectedValue, setSelectedValue] = useState<string>();
  const [hookOptions, setHookOptions] = useState<any>();
  const [generalProps, setGeneralProps] = useState<any>();
  // const [componentId, setComponentId] = useState<any>();
  const [videos, setVideos] = useState<{ [key: string]: string }>({});
  type VideoObject = { video: string };
  const [fullVideoList, setfullVideoList] = useState<VideoObject[]>([]);
  // const [texts, setTexts] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [loading3, setLoading3] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

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


  useEffect(() => {
    let genProps = {};

    // if (video_template === 'inputProps') {
    //   genProps = {
    //     title: video_hook,
    //     video: videos.video1 // Assuming videos.video1 is the correct video URL
    //   };
    // } else if (video_template === 'readCaptionProps') {
    //   genProps = {
    //     title: video_hook,
    //     video1: videos.video1, // Assuming videos.video1 and videos.video2 are the correct video URLs
    //     video2: videos.video2
    //   };
    // }

    genProps = {
      title: video_hook,
      readCap: "Read Caption ↓",
      video1: videos.video1, // Assuming videos.video1 and videos.video2 are the correct video URLs
      video2: videos.video2,
      selectedFont: "Montserrat"
    };

    setGeneralProps(genProps);
  }, [videos, video_template,video_hook]); // Specify the correct dependencies

  const generateVideoCaption = async (values: z.infer<typeof FormSchema3>) => {
    try {

      // setVideoHook(values.hook)

      isLoading3 = true;

      let genProps = {};

      genProps = readCaptionProps;

      console.log('here here here is the video 23o')

      setVideoTemplate(values.video_template)

  
      // if (video_template === 'inputProps') {
      //   genProps = inputProps;
      // } else if (video_template === 'readCaptionProps') {
      //   genProps = readCaptionProps;
      // }
    
      axios.get(`/api/get-content`).then((response1: { data: any; }) => {
          const videos = response1.data;
          if(videos.length > 0){

            const transformedVideos = videos.map((video: any) => ({ video: video.video }));

            setfullVideoList(transformedVideos);
  
        
            const videoCount: number = Object.keys(genProps).filter((key) => key.startsWith('video')).length;
        
            console.log(videoCount);
        
            for (let i = 0; i < videoCount; i++) {
              const videoName = `video${i + 1}`;
              const randomIndex = Math.floor(Math.random() * videos.length); // Generate a random index
              const randomVideo = videos[randomIndex]; // Access the video at the random index
              console.log('here3');
              setVideos((prevState: any) => ({ ...prevState, [videoName]: randomVideo.video }));
            }
          }
      })

      // setVideoLink(randomVideo.video)

      const body = {
        hook: video_hook,
        target_audience: target_audience,
        video_template: values.video_template,
        caption_template: values.caption_template,
        video_topic: video_topic,
        call_to_action: call_to_action,
        personal_insights: personal_insights
      }

      console.log('here here here is the video template:')
      console.log(video_template)

      const response = await axios.post(`/api/get-caption`, body);

      setGeneratedCaption(response.data);

      isLoading3 = false;

      setHookOptions(undefined);
      form.reset();
      form2.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        setCurrentStep(0);
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  }

  const getTemplates = async (values: z.infer<typeof FormSchema2>) => {
    try {

      setVideoHook(values.hook)

      setCurrentStep(2);


    } catch (error: any) {
      if (error?.response?.status === 403) {
        setCurrentStep(0);
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
      setCurrentStep(1);

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
        setCurrentStep(0);
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
        setCurrentStep(0);
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
      setCurrentStep(0);
      setGeneratedCaption(undefined);
      setVideoTemplate(undefined)
      setCaptionTemplate(undefined)
      setVideoTopic(undefined)
      setHookOptions(undefined);
      setTargetAudience(undefined)

      form.reset();
      form2.reset();
      form3.reset();

      isLoading1 = false;
      isLoading2 = false;
      isLoading3 = false;

    } catch (error: any) {
      if (error?.response?.status === 403) {
        setCurrentStep(0);
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
    { label: "Read Caption", value: 'read-caption', description:`Clear call-to-action for your viewer to read your caption.\n\nUses two clips from your content bank which you can change.`, url: 'https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/templates/read-caption.mp4?t=2024-04-13T16%3A36%3A01.379Z' },
    // { label: "Read Caption", value: 'readCaptionProps' },
    { label: "No Call to Action", value: 'no-cta', description:`Just a straight video showing your hook. Lets your viewer naturally check the caption.\n\nUses one clip from your content bank which you can change.`, url: 'https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/templates/no-cta.mp4?t=2024-04-13T16%3A17%3A07.380Z' },
  ] as const

  const caption_templates = [
    { label: "How To", value: 'How To', description: 'Instructional caption on how to do something.' },
    // { label: "Read Caption", value: 'readCaptionProps' },
    { label: "Story", value: 'Story', description: 'Longer caption that tells a story about your experience.' },
    { label: "Bullet List", value: "Bullet List", description: 'Concise caption with bullet points about your topic.' },
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
      
      {currentStep === 0 && (
        <div className="h-full">
          <div className="flex justify-center pb-10">  
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
                        placeholder="E.g. Content creators that sell digital products in Instagram" 
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
                      placeholder="E.g. For me, the biggest lesson is how to market your products. Not being too pushy but still raising awareness and converting clients. For that, what I do is..." 
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
                  <FormControl className="w-full">
                    <Input
                      placeholder="E.g. If you want a free guide on how to get started, comment “guide” and I’ll send it to you 🎁"
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
                  <PopoverContent className={` ${isMobile ? '' : ''}`}>
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
      { currentStep === 1 && (
        <div className="h-full">
        <div className="flex justify-center pb-10">  
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
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}  className="flex flex-col space-y-1">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(hookOptions).map(([key, label], index)  => (
              <Card key={index} className={`${field.value === label ? 'p-5 bg-secondary' : 'p-5'}`}>
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
          <div className="pt-10 flex justify-end ">

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
      {currentStep === 2 && !generated_caption && (
        <div className="h-full">
         <div className="flex justify-center pb-10">  
           <ul className="steps w-1/2">
             <li className="step step-primary">Topic</li>
             <li className="step step-primary">Hook</li>
             <li className="step step-primary">Templates</li>
           </ul>
         </div>
       {/* <Card className="p-5 h-[65vh]"> */}
       <h2 className="text-xl font-medium pb-5">Choose a caption template</h2>
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
        <Form {...form3}>
          <form onSubmit={form3.handleSubmit(generateVideoCaption)}>
          <FormField
            control={form3.control}
            name="caption_template"
            render={({ field }: { field: any }) => (
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}  className="flex flex-col space-y-1">
          <div className="grid grid-cols-3 gap-4">
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
          <h2 className="text-xl font-medium pb-5 pt-6">Choose a video template</h2>
          <FormField
            control={form3.control}
            name="video_template"
            render={({ field }: { field: any }) => (
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}  className="flex flex-col space-y-1">
          <div className="w-3/4 grid grid-cols-2 gap-4 content-center">
            {Object.entries(video_templates).map(([key, label], index)  => (
              <Card key={index} className={`cursor-pointer ${field.value === label.label ? 'p-5 bg-secondary' : 'p-5'}`}>
              <FormItem className="flex items-center space-x-3 space-y-0" key={index}>
              <FormControl>
                <RadioGroupItem value={label.label as string}/>
              </FormControl>
              <FormLabel className="font-normal cursor-pointer flex gap-4">
                  {/* <video  className={`h-60  cursor-pointer`}
                    controls={true} 
                    muted
                    autoPlay
                    loop
                    >
                    <source src={label.url} type="video/mp4" />
                  </video> */}
                
                  <div>
                    <h2 className="text-lg font-medium pb-2">{label.label as string}</h2>
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
          <div className=" flex justify-end ">

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
          <div className={`flex space-y-4 ${isMobile ? 'h-screen' : 'flex-col '}`} >
            <div className={`${isMobile ? 'h-screen' : ' grid grid-rows-2 gap-6 lg:grid-cols-3 lg:grid-rows-1'}`}>
            {isMobile && ( <Button variant="secondary" onClick={returnButton} className="mb-5">
               <Undo2 className="h-4 w-4 mr-1" />
               <span className="">Return</span>
             </Button>)}
           {!isMobile && (<div className="col-span-1">
            <Button variant="secondary" onClick={returnButton} className="mb-5">
               <Undo2 className="h-4 w-4 mr-1" />
               <span className="">Return</span>
             </Button>
             {fullVideoList.length >= 2 && (<div><h1 className="mb-5">Video Options</h1>
             <RenderControls
              setInputProps={setGeneralProps}
              inputProps={generalProps}
              videos={fullVideoList}
              video_template={video_template}
            ></RenderControls></div>)}
           </div>)}
           {isLoading1 && (
              <div className="p-20">
                <Loader />
              </div>
            )}
           {isMobile && (<div className="flex text-center text-gray-900 mb-5 text-sm">Please access on PC or Mac to generate and download videos.</div>)}
             {!isMobile && (<div className="rounded-md border bg-muted flex justify-center col-span-1 h-[78vh]">
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
             {fullVideoList.length < 2 && 
            (<div className="grid content-center text-center space-x-4 p-4"> 
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  To generate videos, first add at least two videos in your content bank.
                </p>

              </div>)}
           {fullVideoList.length >= 2 && video_template === "Read Caption" && (
              <Player
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
                />
                )}
            {fullVideoList.length >= 2 && video_template === "No Call to Action" && (
              <Player
                  component={BulletList}
                  inputProps={generalProps}
                  durationInFrames={DURATION_IN_FRAMES}
                  fps={VIDEO_FPS}
                  compositionHeight={VIDEO_HEIGHT}
                  compositionWidth={VIDEO_WIDTH}
                  controls
                  autoPlay
                  style={{ height: "100%" }}
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
              </div>)}
              {isMobile && (<div className="mb-1 ml-2">Generated Caption:</div>)}
             <Textarea
               placeholder="You erased the whole caption!"
               className={`${isMobile ? 'overflow-y-auto h-full' : 'col-span-1'}`}
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
