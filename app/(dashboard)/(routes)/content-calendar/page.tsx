"use client";

import { Calendar, Cog, Pen, Undo2, Lock , MailWarning } from "lucide-react";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Table ,TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/remotion/Spinner/Spinner";
import { useRouter } from "next/router";
import { RenderControls } from "@/components/RenderControls";
import { Player } from "@remotion/player";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
import { Loader } from "@/components/loader";
import { checkSubscription } from "@/lib/subscription";
import { useProModal } from "@/hooks/use-pro-modal";

import { useMediaQuery } from 'react-responsive';

const ContentPlan = () => {

  const [contentPlan, setContentPlan] = useState([]);
  const [generated_caption, setGeneratedCaption] = useState<string>();
  const [video_topic, setVideoTopic] = useState<string>();
  const [target_audience, setTargetAudience] = useState<string>();
  const [hookOptions, setHookOptions] = useState<any>();
  const [video_template, setVideoTemplate] = useState<string>();
  const [caption_template, setCaptionTemplate] = useState<string>();
  const [video_hook, setVideoHook] = useState<string>();
  const [CTA, setCTA] = useState<string>();
  const [videos, setVideos] = useState<{ [key: string]: string }>({});
  type VideoObject = { video: string };
  const [fullVideoList, setfullVideoList] = useState<VideoObject[]>([]);
  const [generalProps, setGeneralProps] = useState<any>();
  const [isLoading1, setIsLoading1] = useState(false);
  const [closeDialog, setCloseDialog] = useState(false);
  // const [isPro, setIsPro] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const proModal = useProModal();

  const FormSchema = z.object({
    niche: z.string({
      required_error: "Please describe your niche and ideal audience.",
    }),
    struggles: z.string({
      required_error: "Please write some struggles they usually face.",
    }),
    mistakes: z.string({
      required_error: "Please write some mistakes they make.",
    }),
    social_proof: z.string({
      required_error: "Please write some social proof that should be shown.",
    }),
    re_generate: z.boolean().default(false),
    specific_content: z.string({
      required_error: "If you don't have any speficic content ideas, please write None.",
    }),
  })

  const FormSchema2 = z.object({
    hook: z.string({
      required_error: "Please select a hook for the video.",
    }),
    personal_insights: z.string({
      required_error: "Please write some personal insights.",
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const form2 = useForm<z.infer<typeof FormSchema2>>({
    resolver: zodResolver(FormSchema2),
  })

  useEffect(() => {
       // const isProAux = await checkSubscription();
    // setIsPro(isProAux)
    const fetchContentPlan = async () => {
    const body = { first_time: true, re_generate: false };

      try {
        setIsLoading1(true)
        const response = await axios.post(`/api/get-content-plan`, body);
        setTargetAudience(response.data.niche)
        if(response.data.content_plan){
          setContentPlan(response.data.content_plan);
        }else{
          setContentPlan([]);
        }
        setIsLoading1(false)
      } catch (error) {
        console.error("Failed to fetch content plan:", error);
        // Handle error appropriately, e.g., show a message to the user
      }

    };

    fetchContentPlan();
  }, []); 

  // useEffect(() => {

  //   const fetchIsPro = async () => {
      
  //       const isProAux = await checkSubscription();
  //       setIsPro(isProAux)
  //   };

  //   fetchIsPro();
  //   }, []); 

  let isLoading = form.formState.isSubmitting;
  let isLoading2 = false;
  
  const generatePlan = async (values: z.infer<typeof FormSchema>) => {
    try {

      isLoading = true;

      if (contentPlan.length > 0) {
        values.re_generate = true
      }

      setTargetAudience(values.niche)

      const response = await axios.post(`/api/get-content-plan`, values);

      if (response.status === 200) {
        toast.success("Plan generated successfully.");

        // console.log(response.data)
        // console.log('here')
    
        setContentPlan(response.data)
        // console.log('final')
        // console.log(contentPlan)
      }
      
      isLoading = false;

    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    }
  }

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
  }, [videos, video_template, video_hook]); // Specify the correct dependencies


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
      readCap: "Read Caption ⬇️",
      selectedFont: "Montserrat"
    };
  }, [video_hook,  videos.video1,  videos.video2]);

  const onCreate = async (video_topic: string, video_type: string, cta: string) => {
    try {
      
      const values = {
        target_audience: target_audience,
        video_topic: video_topic
      }

      isLoading2 = true;

      const response = await axios.post(`/api/get-hook`, values);

      setHookOptions(response.data);

      setVideoTemplate(video_type)

      // if (video_type === 'How To') {
      //   setVideoTemplate('how_to')
      // } else if (video_type === 'Read Caption') {
      //   setVideoTemplate('readCaptionProps')
      // }
      setVideoTopic(video_topic)
      setCTA(cta)

      isLoading2 = false;

    } catch (error: any) {
      if (error?.response?.status === 403) {
        //  setCloseDialog(true);
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } 
  }

  const returnButton = async () => {
    try {
      setGeneratedCaption(undefined);
      setVideoTemplate(undefined)
      setCaptionTemplate(undefined)
      setVideoTopic(undefined)
      setHookOptions(undefined);
      setTargetAudience(undefined)

      form2.reset();

      isLoading = false;

    } catch (error: any) {
      if (error?.response?.status === 403) {
      } else {
        toast.error("Something went wrong.");
      }
    }
  }


  const generateVideo = async (values: z.infer<typeof FormSchema2>) => {
    try {

      setIsLoading1(true)
      setVideoHook(values.hook)

      let genProps = {};

      genProps = readCaptionProps;
  
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
  
              setVideos((prevState: any) => ({ ...prevState, [videoName]: randomVideo.video }));
            }
          }
      })

      // setVideoLink(randomVideo.video)

      const body = {
        hook: values.hook,
        target_audience: target_audience,
        video_template: video_template,
        caption_template: caption_template,
        video_topic: video_topic,
        call_to_action: CTA,
        personal_insights: values.personal_insights
      }

      console.log(body)

      const response = await axios.post(`/api/get-caption`, body);


      setGeneratedCaption(response.data);

      setIsLoading1(false)
      
      setHookOptions(undefined);

      form2.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } 
  }


  return ( 
    <div>
      <Heading
        title="Content Planner"
        description="High Level View of Generated Posts"
        icon={Calendar}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className={` px-4 ${isMobile ? 'pb-20 h-max pr-4' : 'pl-10 pr-16'}`}>
      <Separator className="my-4" />
      {contentPlan.length == 0 && !generated_caption && !isLoading1 && ( <div className="flex justify-center">
        <div className={` w-5/6 aspect-[2/1] object-cover transition-all  justify-center text-center rounded-md ${isMobile ? 'mt-20' : 'mt-16'}`}>
          <h3 className={`text-lg font-semibold ${isMobile ? 'mt-36 ' : 'mt-40'}`}>Create a content plan</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Generate a new tailored content plan to always know what to post.
          </p>
          <Dialog >
              <DialogTrigger> <Button><Cog className=""/>Generate</Button></DialogTrigger>
              <DialogContent className={`overflow-auto scroll-smooth h-5/6 ${isMobile ? '' : ''}`} >
             
                <DialogHeader>
                  <DialogTitle>Create a new Content Plan</DialogTitle>
                  <DialogDescription>
                    Answer a few questions to generate a new content plan.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(generatePlan)} className="space-y-6">
                    <FormField
                        name="niche"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3 pt-2">
                            <FormLabel>How would you describe your niche/ideal audience?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. My niche is about making money with digital products and instagram. My ideal audience is content creators wanting to grow their Instagram." 
                                {...field}
                              />
                            </FormControl>
               
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="struggles"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3">
                            <FormLabel>What are some common struggles or questions of your ideal audience?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. Not knowing how often to post, or what to post. Not focusing on hooks and giving value. Not knowing growth strategies." 
                                {...field}
                              />
                            </FormControl>
          
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="mistakes"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3">
                            <FormLabel>What are some mistakes they usually make?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. Not improving their content. Focusing too much on quantity over quality. Disregarding the importance of IG stories." 
                                {...field}
                              />
                            </FormControl>
             
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="social_proof"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-2">
                            <FormLabel>What kind of social proof do they need to see?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. That I have grown my Instagram audience by 5k followers in the last month."  
                                {...field}
                              />
                            </FormControl>
                 
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="specific_content"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-2">
                            <FormLabel>What are some specific topics you would like to cover with your content?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. I would like to make multiple posts about how I've built a digital product with Canva and have marketed it with my Instagram."  
                                {...field}
                              />
                            </FormControl>
                 
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <div className={`flex justify-end`}>
                    <Button type="submit" variant="secondary" className="justify-end">
                        {isLoading && <Spinner size={20}></Spinner>}
                        <span className="pl-2">Generate Plan</span>
                        </Button>
                    </div>
                  </form>
                </Form>
            
              </DialogContent>
            </Dialog>
            {isMobile && (<div className="text-center text-gray-500 mt-5 text-xs">This app was designed to be used on PC or Mac. For a better experience, use it on Desktop.</div>)}
        </div>
      </div>)}

      {contentPlan.length > 0 && !generated_caption && !isLoading1 && (<Tabs defaultValue="week1" className="space-y-4">
        <div  className="flex justify-between" >
         <TabsList>
              <TabsTrigger value="week1" >
                Week 1
              </TabsTrigger>
              <TabsTrigger value="week2" >
                Week 2
              </TabsTrigger>
              <TabsTrigger value="week3" >
                Week 3
              </TabsTrigger>
              <TabsTrigger value="week4" >
                Week 4
              </TabsTrigger>
            </TabsList>
            {/* {!isPro && (<Button onClick={proModal.onOpen} variant={'secondary'}><Lock size={20} className="pr-1"/>Re-Generate</Button>)} */}
            <Dialog>
              <DialogTrigger> <Button  className={`${isMobile ? 'ml-1' : ''}`}><Cog className={`${isMobile ? '' : 'pr-1'}`} />{!isMobile && (<span>Re-Generate</span>)}</Button></DialogTrigger>
              <DialogContent className={`overflow-auto scroll-smooth h-5/6 ${isMobile ? '' : ''}`} >
                <DialogHeader>
                  <DialogTitle>Create a new Content Plan</DialogTitle>
                  <DialogDescription>
                    Answer a few questions to generate a new content plan. Your current plan will be overwritten.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(generatePlan)} className="space-y-6">
                    <FormField
                        name="niche"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3 pt-2">
                            <FormLabel>How would you describe your niche/ideal audience?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. My niche is about making money with digital products and instagram. My ideal audience is content creators wanting to grow their Instagram."
                                {...field}
                              />
                            </FormControl>
               
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="struggles"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3">
                            <FormLabel>What are some common struggles or questions of your ideal audience?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. Not knowing how often to post, or what to post. Not focusing on hooks and giving value. Not knowing growth strategies."
                                {...field}
                              />
                            </FormControl>
          
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="mistakes"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-3">
                            <FormLabel>What are some mistakes they usually make?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. Not improving their content. Focusing too much on quantity over quality. Disregarding the importance of IG stories." 
                                {...field}
                              />
                            </FormControl>
             
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="social_proof"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-2">
                            <FormLabel>What kind of social proof do they need to see?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. That I have grown my Instagram audience by 5k followers in the last month." 
                                {...field}
                              />
                            </FormControl>
                 
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <FormField
                        name="specific_content"
                        render={({ field }: { field: any }) => (
                          <FormItem className="flex flex-col pb-2">
                            <FormLabel>What are some specific topics you would like to cover with your content?</FormLabel>
                            <FormControl className="w-full">
                              <Textarea
                                
                                disabled={isLoading
                                } 
                                placeholder="E.g. I would like to make multiple posts about how I've built a digital product with Canva and have marketed it with my Instagram."  
                                {...field}
                              />
                            </FormControl>
                 
                            <FormMessage />
                          </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                    <Button type="submit" variant="secondary" className="justify-end">
                        {isLoading && <Spinner size={20}></Spinner>}
                        <span className="pl-2">Re-generate Plan</span>
                        </Button>
                    </div>
                  </form>
                </Form>

              </DialogContent>
            </Dialog>
            </div>
            {contentPlan.map((weekTopics: any[], index: number) => (
            <TabsContent key={index} value={`week${index + 1}`} className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Post Type</TableHead>
                    <TableHead>CTA</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weekTopics.map((topic) => (
                    <TableRow key={topic.weekDay}>
                    <TableCell>{topic.topic}</TableCell>
                    <TableCell>
                        {topic.type == 'Story' && <Badge variant={"low"}>{topic.type}</Badge>}
                        {topic.type == 'Bullet List' && <Badge variant={"medium"}>{topic.type}</Badge>}
                        {topic.type == 'How To' && <Badge variant={"medium2"}>{topic.type}</Badge>}
                    </TableCell>
                    <TableCell>{topic.cta}</TableCell>
                    <TableCell className="text-right">
                      {!closeDialog && (<Dialog>
                        <DialogTrigger><Button variant={"outline"} onClick={() => onCreate(topic.topic, topic.type, topic.cta)}>Create<Pen className="pl-2"/></Button></DialogTrigger>
                        <DialogContent className="max-w-[1000px]">
                          <DialogHeader>
                            <DialogTitle>Create a Video</DialogTitle>
                            <DialogDescription className="mb-10">
                              We just need a few extra inputs...
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...form2}>
                              <form onSubmit={form2.handleSubmit(generateVideo)}>
                              <span className="text-sm font-medium">Choose a hook</span>
                              <FormField
                                control={form2.control}
                                name="hook"
                                render={({ field }: { field: any }) => (
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value}  className="flex flex-col space-y-1 mt-3">
                              {hookOptions && !isLoading2 && (<div className="grid grid-cols-3 gap-4">
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
                              </div>)}
                              {isLoading2 && ( 
                                <div className="">
                                  <Loader />
                                </div>)}
                              </RadioGroup>
                                )}
                              />
                              <FormField
                                  name="personal_insights"
                                  render={({ field }: { field: any }) => (
                                    <FormItem className="flex flex-col mt-10">
                                      <FormLabel>Write some personal insights</FormLabel>
                                      <FormControl className="w-full">
                                        <Textarea
                                          
                                          disabled={isLoading1
                                          } 
                                          placeholder="What is your unique point of view regarding this topic?" 
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Add a personal touch to your content to increase engagement.
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                              />
                              <div className="flex justify-end">
                              <DialogClose asChild>
                              <Button type="submit" variant="secondary" className={`justify-end ${isMobile ? 'mt-5' : 'mt-5'}`}>
                                  {isLoading && <Spinner size={20}></Spinner>}
                                  <span className="">Create Video</span>
                                  </Button>
                              </DialogClose>
                              </div>
                            </form>
                          </Form>

                        </DialogContent>
                      </Dialog>)}
                    </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          ))}
      </Tabs>
      )}
      {isLoading1 && ( 
            <div className="mt-60">
              <Loader />
            </div>)}
      {generated_caption && generalProps && (
          <div className={`flex space-y-4 ${isMobile ? 'h-screen' : 'flex-col '}`} >
           <div className={`${isMobile ? 'h-screen' : 'grid grid-rows-2 gap-6 lg:grid-cols-3 lg:grid-rows-1'}`}>
           {isMobile && ( <Button variant="secondary" onClick={returnButton} className="mb-5">
               <Undo2 className="h-4 w-4 mr-1" />
               <span className="">Return</span>
             </Button>)}
           {!isMobile && (<div className="col-span-1">
            <Button variant="secondary" onClick={returnButton} className="mb-5">
               <Undo2 className="h-4 w-4 mr-1" />
               <span className="">Return</span>
             </Button>
             <h1 className="mb-5">Video Options</h1>
             {fullVideoList.length < 2 && 
            (<RenderControls
              setInputProps={setGeneralProps}
              inputProps={generalProps}
              videos={fullVideoList}
            ></RenderControls>)}
           </div>)}
           {isMobile && (<div className="flex text-center text-gray-900 mb-5 text-sm">Please access on PC or Mac to generate and download videos.</div>)}
             {!isMobile && (<div className="rounded-md border bg-muted flex justify-center col-span-1  h-[78vh]">
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
                />)} */}
            {fullVideoList.length < 2 && 
            (<div className="grid content-center text-center space-x-4 p-4"> 
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  To generate videos, first add at least two videos in your content bank.
                </p>
              </div>)}
           {fullVideoList.length >= 2 && (<Player
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
              </div>)}
              {isMobile && (<div className="mb-1 ml-2">Generated Caption:</div>)}
              <Textarea
               placeholder="You erased the whole caption!"
               className={`${isMobile ? '' : 'col-span-1'}`}
               defaultValue={generated_caption}
             />
           </div>
         </div>
        )}
        <div/> 
    </div>
    </div>
   );
}
 
export default ContentPlan;

