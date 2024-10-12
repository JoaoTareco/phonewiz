"use client"

import { FileStack, FileVideo, Home, PenLine, Settings } from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";
import { PostHistory } from "@/components/post-history";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CaptionPlayground } from "@/components/caption-playground";

const CaptionPlaygroundPage = () => {

  return ( 
    <div>
      <Heading
        title="Caption Playground"
        description="Generate new captions."
        icon={PenLine}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
      <Separator className="" />
      <CaptionPlayground  />
    </div>
    </div>
   );
}
 
export default CaptionPlaygroundPage;

