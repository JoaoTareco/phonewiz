import { UserButton } from "@clerk/nextjs";

import { MobileSidebar } from "@/components/mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { Button } from "@/components/ui/button"
import { PlusCircle, Maximize2, HelpCircle, Bell, RefreshCw } from 'lucide-react'
import Image from 'next/image'; // Ensure this import is present


const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return ( 
    <div className="flex items-center p-6">
            
        <div className="flex items-center gap-2">
 
        </div>
    
      <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount as number} />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
   );
}
 
export default Navbar;