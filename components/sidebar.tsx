"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from 'next/font/google'
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { FreeCounter } from "@/components/free-counter";

const poppins = Montserrat ({ weight: '600', subsets: ['latin'] });

const routes = [
  {
    label: 'Content Calendar',
    icon: LayoutDashboard,
    href: '/content-calendar',
    color: "text-sky-500"
  },
  {
    label: 'Post Generator',
    icon: ImageIcon,
    color: "text-pink-700",
    href: '/post-generator',
  },
  {
    label: 'Templates',
    icon: ImageIcon,
    color: "text-pink-700",
    href: '/templates',
  },
  {
    label: 'Content Bank',
    icon: MessageSquare,
    href: '/content-bank',
    color: "text-gray-500",
  },
  // {
  //   label: 'Video Bank',
  //   icon: ImageIcon,
  //   color: "text-pink-700",
  //   href: '/video-bank',
  // },
  // {
  //   label: 'Music Generation',
  //   icon: Music,
  //   color: "text-emerald-500",
  //   href: '/music',
  // },
  // {
  //   label: 'Keyword Insights',
  //   icon: Code,
  //   color: "text-green-700",
  //   href: '/keywords',
  // },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false
}: {
  apiLimitCount: number;
  isPro: boolean;
}) => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background text-foreground border border-border">
      <div className="px-3 py-2 flex-1">
      <Link href="/dashboard" className="flex items-center">
          <div className="relative h-16 w-32 ml-7">
            <Image fill alt="Logo" src="/ctrlcap.png" />
          </div>
          {/* <h1 className={cn("text-2xl font-bold", poppins.className)}>
            Locus
          </h1> */}
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
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
          ))}
        </div>
      </div>
      <FreeCounter 
        apiLimitCount={apiLimitCount} 
        isPro={isPro}
      />
    </div>
  );
};
