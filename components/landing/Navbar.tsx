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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"


export default function NavigationMenuLanding() {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const [showDialog, setShowDialog] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          toast.success("You've been added to the waitlist, we'll be in touch soon!");
          setShowDialog(false);
        } else {
          toast.error("There was an error. Please try again.");
        }
      } catch (error) {
        toast.error("There was an error. Please try again.");
      }
    };

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
    <>
    <div className="w-full px-4 sm:px-10 py-1 flex justify-between ">
        <div className="flex">
        <span className="py-3">PHONEWIZ LOGO HERE</span>
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
  
   
            <Link href="/dashboard" >
                <Button className="hover:-translate-x-1 transition duration-400">Go to dashboard <ArrowUpRight className="pl-2"/></Button>
            </Link>
           
   
    </div>
    </div>

    <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Great to see you joining us!</DialogTitle>
            <DialogDescription className="">
            <br/>
              We are letting new content creators in every day. We&apos;ll notify you when you&apos;ve got access:
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="mt-4">Get Access</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
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
            <Button 
              className="hover:-translate-x-1 transition duration-400 text-xs"
              onClick={() => setShowDialog(true)}
            >
              Get Access <ArrowUpRight className="pl-2"/>
            </Button>
        </div>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Great to see you joining us!</DialogTitle>
            <DialogDescription className="">
            <br/>
              We are letting new content creators in every day. We&apos;ll notify you when you&apos;ve got access:
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="mt-4">Get Access</Button>
          </form>
        </DialogContent>
      </Dialog>
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
