import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { checkSubscription } from "@/lib/subscription";
import { getApiLimitCount } from "@/lib/api-limit";


const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const apiLimitCount = await getApiLimitCount() ||  0;
  const isPro = await checkSubscription();

  return ( 
    <div className="h-full relative bg-zinc-50">
      <div className="hidden h-full md:flex md:w-41 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
      <Sidebar isPro={isPro} apiLimitCount={apiLimitCount as number} />
      </div>
      <main className="md:pl-60 pb-10 bg-zinc-50 h-screen">
        <Navbar />
        {children}
      </main>
    </div>
   );
}
 
export default DashboardLayout;
