"use client";

import axios from "axios";
import { useState } from "react";
import { Check, MoveUpRight, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from 'next/image'

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { tools } from "@/constants";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { checkSubscription } from "@/lib/subscription";
import { SubscriptionButton } from "./subscription-button";

export const ProModal = () => {
  const proModal = useProModal();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center font-semibold text-xl">
             Upgrade to <p className="ml-1 font-bold">ctrl</p><p className="text-primary font-bold mr-1">cap</p> Pro
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {/* {tools.map((tool) => (
              <Card key={tool.href} className="p-3 border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">
                    {tool.label}
                  </div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))} */}
            <div className="">
              <Image 
                src="/discount.png"
                alt="Pro modal image"
                width={230}
                height={230}
                className={cn("rounded-md")}
              />
             <div className="">
              <div className=" mb-5 text-black"><span className="line-through text-mute">$29,99</span> <span className=" font-bold">$10</span></div>
              <div className=""><span className="text-2xl font-bold text-primary">Unlimited</span> <span className="text-primary text-2xl">Posts</span></div>
              <div className=" text-black font-lg mt-5">And guarantee this price forever</div>
            </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="">

            <Button disabled={loading} onClick={onSubscribe} size="lg" type="submit" className="w-full shadow-lg shadow-red-500/50 mt-10">
              Upgrade
   
              <MoveUpRight className="w-4 h-4 ml-2 fill-white" />
            </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
