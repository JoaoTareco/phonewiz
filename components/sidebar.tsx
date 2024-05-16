"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { Code, ImageIcon, LayoutDashboard, LifeBuoy, MessageSquare, Music, Newspaper, Settings, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { FreeCounter } from "@/components/free-counter";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useMediaQuery } from "react-responsive";
import { FeedbackDialog } from "./feedback-form";

const poppins = Montserrat ({ weight: '600', subsets: ['latin'] });

const routes = [
  // {
  //   label: 'Home',
  //   icon: LayoutDashboard,
  //   href: '/dashboard',
  //   color: "text-sky-500"
  // },
  {
    label: 'Post Generator',
    icon: ImageIcon,
    color: "text-pink-700",
    href: '/post-generator',
    mobile: true,
  },
  {
    label: 'Content Planner',
    icon: LayoutDashboard,
    href: '/content-calendar',
    color: "text-sky-500",
    mobile: false,
  },
  // {
  //   label: 'Templates',
  //   icon: ImageIcon,
  //   color: "text-pink-700",
  //   href: '/templates',
  // },
  {
    label: 'Content Bank',
    icon: MessageSquare,
    href: '/content-bank',
    color: "text-gray-500",
    mobile: true,
  },
  // {
  //   label: 'Settings',
  //   icon: Settings,
  //   href: '/settings',
  // },
];

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false,
  boughtTokensCount = 10
}: {
  apiLimitCount: number;
  isPro: boolean;
  boughtTokensCount: number;
}) => {
  const pathname = usePathname();

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background text-foreground border border-border">
      <div className="px-3 py-2 flex-1">
      <Link href="/content-calendar" className="flex items-left">
          <div className="relative h-16 w-32 ml-4 mr-4">
            <Image fill alt="Logo" src="/ctrlcap.png" />
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            route.mobile || !isMobile ? 
            <Link
            key={route.href} 
            href={route.href}
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-accent-foreground hover:bg-secondary rounded-lg transition",
              pathname === route.href ? "text-accent-foreground bg-secondary" : "text-muted-foreground",
            )}
          >
            <div className="flex items-center flex-1">
              {/* <route.icon className={cn("h-5 w-5 mr-3", route.color)} /> */}
              {route.label}
            </div>
          </Link> 
            :
            // <Link
            //   key={route.href} 
            //   href={route.href}
            //   className={cn(
            //     "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-accent-foreground hover:bg-secondary rounded-lg transition",
            //     pathname === route.href ? "text-accent-foreground bg-secondary" : "text-muted-foreground",
            //   )}
            // >
              <div key={route.href} className="flex items-center flex-1 text-sm group p-3 w-full justify-start font-medium cursor-pointer hover:text-accent-foreground  rounded-lg transition">
                {/* <route.icon className={cn("h-5 w-5 mr-3", route.color)} /> */}
                {route.label} <Badge className="ml-2 text-xs " variant={'secondary'}>Only on Desktop</Badge>
              </div>
            // </Link>
          ))}
        </div>
      </div>
      <Card className="bg-white/10 border-1">
        <CardContent className="py-6">
        <FeedbackDialog/>
        </CardContent>
      </Card>
      <FreeCounter 
        apiLimitCount={apiLimitCount} 
        isPro={isPro}
        boughtTokensCount={boughtTokensCount}
      />
    </div>
  );
};
