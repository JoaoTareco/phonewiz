"use client";

import { Calendar } from "lucide-react";

import { Heading } from "@/components/heading";


const CodePage = () => {

  return ( 
    <div>
      <Heading
        title="Content Calendar"
        description="High Level View of Generated Posts"
        icon={Calendar}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8">
      </div>
    </div>
   );
}
 
export default CodePage;

