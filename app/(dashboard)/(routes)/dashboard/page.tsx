"use client";

import { Home } from "lucide-react";

import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";


const CodePage = () => {

  return ( 
    <div>
      <Heading
        title="Welcome!"
        description="Start creating awesome content."
        icon={Home}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8">
      <Separator className="my-4" />
      </div>
    </div>
   );
}
 
export default CodePage;

