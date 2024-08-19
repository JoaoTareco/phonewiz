"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image";
import { Button } from "../ui/button"
import { ArrowUpRight, Menu } from "lucide-react"
import { useMediaQuery } from "react-responsive"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs"


export default function NavigationMenuLanding() {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    const routes = [
        {
          label: 'Pricing',
          href: '/',
        },
        {
          label: 'Blog',
          href: '/',
        },
        {
          label: 'Contact',
          href: '/',
        },
        
      ];

    if (!isMobile) {
  return (
    <div className="w-full px-4 sm:px-10 py-1 flex justify-between ">
        <div className="flex">
        <Image
        src="/ctrlcap.png"
        alt="About"
        className=""
        width={100}
        height={50}

        />
    <NavigationMenu className="px-10">
      <NavigationMenuList>
      {/* <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
    </div>
    <div className="flex items-center justify-center">
  
         <SignedIn>
            <Link href="/post-generator" >
                <Button className="hover:-translate-x-1 transition duration-400">Go to app <ArrowUpRight className="pl-2"/></Button>
            </Link>
            </SignedIn>
            <SignedOut>
            <Link href="/sign-up" >
                <Button className="hover:-translate-x-1 transition duration-400 ">Get 5 free posts <ArrowUpRight className="pl-2"/></Button>
            </Link>
        </SignedOut>
   
    </div>
    </div>
  )} else {
      return (
        <>
   
        <div className="w-full px-4 sm:px-10 py-1 flex justify-between ">
            <Image
            
            src="/ctrlcap.png"
            alt="About"
            className=""
            width={100}
            height={50}

            />
        <div className="flex items-center justify-center">
        

            <Link href="/sign-up" >
                <Button className="hover:-translate-x-1 transition duration-400 text-xs">Get 5 free posts <ArrowUpRight className="pl-2"/></Button>
            </Link>

        </div>
        </div>
        </>
      )
  }
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
