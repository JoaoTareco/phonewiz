"use client";

import axios from "axios";
import { Key, useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, MessagesSquare, MoveUpRight, Zap, History, FileStack, FileVideo, RotateCw, ChevronRight, Undo2, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";

import {
  Bird,
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Mic,
  Paperclip,
  Settings,
  Settings2,
  Share,
  Triangle
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { z } from "zod";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProModal } from "@/hooks/use-pro-modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea2 } from "./ui/textarea2";
import { useMediaQuery } from "react-responsive";

const FormSchema = z.object({
  personal_insights: z.string({
    required_error: "Please write some personal insights.",
  }),
  cta: z.string({
    required_error: "Please write a call to action for the video.",
  }),
  target_audience: z.string({
    required_error: "Please indicate the target audience.",
  }),
  topic: z.string({
    required_error: "Please write a caption topic.",
  }),
  template: z.string({
    required_error: "Please choose a caption template.",
  }),
})

interface CaptionPlayground {
  input_props: any,
  setStep: (newValue: number) => void;
  setPostHistoryOut: (props: any) => void;
}


export const CaptionPlayground: React.FC<CaptionPlayground> = ({ input_props, setStep,setPostHistoryOut }) => {
  const proModal = useProModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generated_caption, setGeneratedCaption] = useState<string>();

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })


  useEffect(() => {
    console.log(input_props)
    if(input_props){
      form.setValue('topic',JSON.parse(input_props.video_options).video_topic)
      form.setValue('cta',JSON.parse(input_props.video_options).call_to_action)
      form.setValue('target_audience',JSON.parse(input_props.video_options).target_audience)
      form.setValue('personal_insights',JSON.parse(input_props.video_options).personal_insights)
      form.setValue('template',JSON.parse(input_props.video_options).caption_template)
      setGeneratedCaption(input_props.caption)
    }
  }, []);

  const getCaption = async (values: z.infer<typeof FormSchema>) => {
    try {

      console.log('Submitting form:', values);
      
      setIsLoading(true)
  
      const body = {
        hook: values.topic,
        target_audience: values.target_audience,
        video_template: values.template,
        caption_template: values.template,
        video_topic: values.topic,
        call_to_action: values.cta,
        personal_insights: values.personal_insights
      }

      const response = await axios.post(`/api/get-caption`, body);

      setGeneratedCaption(response.data);
      setPostHistoryOut(null)

      setIsLoading(false)

    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    }finally {
      router.refresh();
    }
  }

  const returnFunction = () => {
    setStep(0)
  }

  return (
    <div className="grid w-full">
      <Button variant="secondary"  className="ml-4  max-w-[6rem]" onClick={returnFunction}>
        <Undo2 className="h-4 w-4 mr-1" />
        <span className="text-sm">Return</span>
      </Button>
      <div className="flex flex-col">
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="relative hidden flex-col items-start gap-8 md:flex lg:col-span-2" x-chunk="dashboard-03-chunk-0"
          >
            <Form {...form}>
            <form onSubmit={form.handleSubmit(getCaption)} id="form1" className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Inputs
                </legend>
                <div className="grid gap-3">
                <FormField
                  name="template"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Template</FormLabel>
                      <FormControl className="w-full">
                        <Select 
                          onValueChange={field.onChange} defaultValue={field.value}
                          disabled={isLoading} 
                        >
                          <SelectTrigger
                            className="items-start [&_[data-description]]:hidden"
                          >
                            <SelectValue placeholder="Select a caption template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bullet List">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                    Bullet List
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                  Concise caption with bullet points about your topic.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="Story">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                      Story
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                  Longer caption that tells a story about your experience.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="How To">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                    How To
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                  Instructional caption on how to do something.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
                </div>
                <div className="grid gap-3">
                  <FormField
                  name="topic"
                  render={({ field }: { field: any }) => (
                    <FormItem >
                      <FormLabel>Video Topic</FormLabel>
                      <FormControl >
                        <Input
                          
                          disabled={isLoading} 
                          placeholder="E.g. How I've made 100k with Instagram." 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
                </div>
                <div className="grid gap-3">
                  <FormField
                  name="target_audience"
                  render={({ field }: { field: any }) => (
                    <FormItem >
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl >
                        <Input
                          
                          disabled={isLoading} 
                          placeholder="E.g. Content creators that sell digital products in Instagram." 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
                </div>
                <div className="grid gap-3">
                  <FormField
                  name="cta"
                  render={({ field }: { field: any }) => (
                    <FormItem >
                      <FormLabel>Call To Action</FormLabel>
                      <FormControl >
                        <Input
                          
                          disabled={isLoading} 
                          placeholder="E.g. If you want a free guide on how to get started, comment “guide” and I’ll send it to you!" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
                </div>
                <div className="grid gap-3">

                    <FormField
                    name="personal_insights"
                    render={({ field }: { field: any }) => (
                      <FormItem >
                        <FormLabel>Personal Insights</FormLabel>
                        <FormControl >
                          <Textarea
                            disabled={isLoading} 
                            placeholder="E.g. If you want a free guide on how to get started, comment “guide” and I’ll send it to you!" 
                            className="min-h-[9rem]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button form="form1" type="submit" variant={"outline"} className="mt-5">
                  <span className="">Generate Caption</span> 
                  { isLoading && (<RotateCw size={16} className="animate-spin ml-2" />)}
                  { !isLoading && (<ChevronRight className="h-4 w-4 ml-1" />)}
                </Button>
              </fieldset>
            </form>
            </Form>
          </div>
          <div className={`relative flex ${isMobile ? "h-[42rem]" : "h-full"} flex-col rounded-xl bg-muted/100 p-4 lg:col-span-1 `}>
            <div>
            <Badge variant="outline" className="absolute right-3 top-3">
              Editable Caption
            </Badge>
            </div>
            {/* <Button onClick={() => {navigator.clipboard.writeText(this.state.textToCopy)}}></Button> */}
            <div className="pt-10" />
            <Textarea2
               defaultValue={generated_caption}
               className="h-full"
             />
          </div>
        </main>
        <div className="absolute inset-x-0 bottom-0 p-6">
        <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden w-full">
              { isLoading && (<RotateCw size={16} className="animate-spin mr-1" />)}
              { !isLoading && (<Pencil size={16} className="mr-1"/>)}
                <span className="">Generate</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className=" overflow-y-auto">
              <DrawerHeader>
                <DrawerTitle>Generate</DrawerTitle>
                <DrawerDescription>
                  Generate a new caption.
                </DrawerDescription>
              </DrawerHeader>
              <Form {...form}>
            <form onSubmit={form.handleSubmit(getCaption)} id="form1" className="grid w-full items-start gap-6">
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Inputs
                </legend>
                <div className="grid gap-3">
                <FormField
                  name="template"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Template</FormLabel>
                      <FormControl className="w-full">
                        <Select 
                          onValueChange={field.onChange} defaultValue={field.value}
                          disabled={isLoading} 
                        >
                          <SelectTrigger
                            className="items-start [&_[data-description]]:hidden"
                          >
                            <SelectValue placeholder="Select a caption template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bullet List">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                    Bullet List
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                  Concise caption with bullet points about your topic.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="Story">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                      Story
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                  Longer caption that tells a story about your experience.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="How To">
                              <div className="flex items-start gap-3 text-muted-foreground">
                                <div className="grid gap-0.5">
                                  <p>
                                    <span className="font-medium text-foreground">
                                    How To
                                    </span>
                                  </p>
                                  <p className="text-xs" data-description>
                                  Instructional caption on how to do something.
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
                </div>
                <div className="grid gap-3">
                  <FormField
                  name="topic"
                  render={({ field }: { field: any }) => (
                    <FormItem >
                      <FormLabel>Video Topic</FormLabel>
                      <FormControl >
                        <Input
                          
                          disabled={isLoading} 
                          placeholder="E.g. How I've made 100k with Instagram." 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
                </div>
                <div className="grid gap-3">
                  <FormField
                  name="target_audience"
                  render={({ field }: { field: any }) => (
                    <FormItem >
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl >
                        <Input
                          
                          disabled={isLoading} 
                          placeholder="E.g. Content creators that sell digital products in Instagram." 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
                </div>
                <div className="grid gap-3">
                  <FormField
                  name="cta"
                  render={({ field }: { field: any }) => (
                    <FormItem >
                      <FormLabel>Call To Action</FormLabel>
                      <FormControl >
                        <Input
                          
                          disabled={isLoading} 
                          placeholder="E.g. If you want a free guide on how to get started, comment “guide” and I’ll send it to you!" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
            />
                </div>
                <div className="grid gap-3">

                    <FormField
                    name="personal_insights"
                    render={({ field }: { field: any }) => (
                      <FormItem >
                        <FormLabel>Personal Insights</FormLabel>
                        <FormControl >
                          <Textarea
                            disabled={isLoading} 
                            placeholder="E.g. If you want a free guide on how to get started, comment “guide” and I’ll send it to you!" 
                            className="min-h-[9rem]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>
            </form>
            </Form>
            <DrawerFooter>
            <DrawerClose asChild>
            <Button form="form1" type="submit" variant={"outline"} className="mt-5">
              <span className="">Generate Caption</span> 
              { isLoading && (<RotateCw size={16} className="animate-spin ml-2" />)}
              { !isLoading && (<ChevronRight className="h-4 w-4 ml-1" />)}
            </Button>
            </DrawerClose>
          </DrawerFooter>
            </DrawerContent>
          </Drawer>
          </div>
      </div>
    </div>
  )

}
