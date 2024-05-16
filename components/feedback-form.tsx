"use client";

import axios from "axios";
import { useState } from "react";
import { Check, MessagesSquare, MoveUpRight, Zap } from "lucide-react";
import { toast } from "react-hot-toast";


import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
    bio: z
      .string()
      .min(1, {
        message: "Please write something.",
      })
  })


export const FeedbackDialog = () => {
    const [thanks, setThanks] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
      })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const response = await axios.post(`/api/post-feedback`, {feedback: data.bio});

        if (response.data == "success"){
            setThanks(true)
        }
      }


  return (
    <div>
    <Dialog >
        <DialogTrigger asChild>

            <Button variant="feedback" className="w-full flex justify-center"><MessagesSquare className="w-4 h-4 mr-1"/><span className="text-xs">Give Feedback</span></Button>


        </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col pb-2">
            <div className="flex items-center font-semibold text-xl">
             Give feedback on <p className="ml-1 font-bold">ctrl</p><p className="text-primary font-bold mr-1">cap</p> 
            </div>
            {/* <div className="flex items-center font-normal">and get 10 extra tokens</div> */}
          </DialogTitle>
          <DialogDescription className="pt-3 space-y-2 text-zinc-900 font-medium">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                        {/* <FormLabel>Bio</FormLabel> */}
                        <FormControl>
                            <Textarea
                            placeholder="What would help you make content?"
                            className="resize-none"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {thanks ? <div>Thank you so much for the feedback!</div> : <div></div>}
                    <div className="flex justify-end"><Button type="submit">Submit</Button></div>
                </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
        {/* <DialogFooter className="">
            <DialogClose asChild>   
                <Button size="lg" type="submit" variant="secondary" className="mt-10">
                   Close
                </Button>
            </DialogClose>  
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
    </div>
  )
}
