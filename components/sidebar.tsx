"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { Calendar, Clapperboard, Code, Home, ImageIcon, LayoutDashboard, LifeBuoy, MessageSquare, Music, Newspaper, Settings, VideoIcon, Videotape, PenLine } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { FreeCounter } from "@/components/free-counter";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useMediaQuery } from "react-responsive";
import { FeedbackDialog } from "./feedback-form";
import { SubscriptionButton } from "./subscription-button";

const poppins = Montserrat ({ weight: '600', subsets: ['latin'] });

// Define your areas and their respective routes
const areas = [
  {
    name: "Plan",
    routes: [
      {
        label: 'Content Planner',
        icon: Calendar,
        href: '/content-planner',
        color: "text-muted-foreground",
        mobile: false,
        area: 'Plan'
     },
 
      // ... other management routes
    ]
  },
  {
    name: "Create",
    routes: [
      {
        label: 'Post Generator',
        icon: Clapperboard,
        color: "text-muted-foreground",
        href: '/post-generator',
        mobile: true,
        area: 'Create'
      },

     {
      label: 'Caption Playground',
  icon: PenLine,
  color: "text-muted-foreground",
  href: '/caption-playground',
  area: 'Create'
},
{
  label: 'Content Bank',
  icon: Videotape,
  href: '/content-bank',
  color: "text-muted-foreground",
  mobile: true,
  area: 'Create'
    },
    ]
  },
  
  // ... other areas
];

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false,
  boughtTokensCount = 20
}: {
  apiLimitCount: number;
  isPro: boolean;
  boughtTokensCount: number;
}) => {
  const pathname = usePathname();

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background text-foreground">
      <div className="px-3 py-2 flex-1">
      <Link href="/home" className="flex items-left">
          <div className="relative h-16 w-32 ml-4 mr-4">
            <Image fill alt="Logo" src="/ctrlcap.png" />
          </div>
        </Link>
        <div className="space-y-1 mt-4">
          <Link
            key="/home"
            href="/home"
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-accent-foreground hover:bg-secondary rounded-lg transition",
              pathname === "/home" ? "text-accent-foreground bg-secondary" : "text-muted-foreground",
            )}
          >
            <div className="flex items-center flex-1">
              <Home className={cn("h-4 w-4 mr-2", "text-muted-foreground")} />
              Home
            </div>
          </Link>
        </div>
        <div className="space-y-6 mt-4">
          {areas.map((area) => (
            <div key={area.name}>
              <h2 className="text-xs uppercase text-muted-foreground font-bold pl-3 mb-2">
                {area.name}
              </h2>
              <div className="space-y-1">
                {area.routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-accent-foreground hover:bg-secondary rounded-lg transition",
                      pathname === route.href ? "text-accent-foreground bg-secondary" : "text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center flex-1">
                      <route.icon className={cn("h-4 w-4 mr-2", route.color)} />
                      {route.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Card className="bg-white/10">
        <CardContent className="py-6">
        <FeedbackDialog/>
        </CardContent>
      </Card>
      <SubscriptionButton isPro={isPro} />
      <FreeCounter 
        apiLimitCount={apiLimitCount} 
        isPro={isPro}
        boughtTokensCount={boughtTokensCount}
      />
    </div>
  );
};
