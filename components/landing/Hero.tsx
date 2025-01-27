"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { AnimatedTooltip } from "./ui/tooltip-faces";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import { motion } from "framer-motion";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { BackgroundLines } from "./ui/background-lines";
import { WobbleCard } from "../wobble-card";

const Hero = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState('');

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

  const people = [
    {
      id: 1,
      name: "John Doe",
      designation: "Software Engineer",
      image:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
    },
    {
      id: 2,
      name: "Robert Johnson",
      designation: "Product Manager",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      name: "Jane Smith",
      designation: "Data Scientist",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 4,
      name: "Emily Davis",
      designation: "UX Designer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 5,
      name: "Tyler Durden",
      designation: "Soap Developer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
    },
    {
      id: 6,
      name: "Dora",
      designation: "The Explorer",
      image:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
    },
  ];

  return (
    <>
      <section className="">
        <div className="">
          <HeroHighlight>
            <div className="flex pt-40 flex-col lg:flex-row lg:items-center  px-4 md:px-20 lg:px-36">
              <div className="text-center">
         
                  <div className="pb-6">
                  <button className="shadow-xl relative inline-flex  overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#2563eb_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-medium text-blue backdrop-blur-3xl">
    Get Early Access
  </span>
</button>
</div>
           
                <motion.h1
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: [20, -5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                  }}
                  className="text-xl sm:text-xl md:text-6xl lg:text-6xl xl:text-6xl font-semibold text-neutral-700 mx-auto  md:px-2 lg:px-6 xl:px-18 2xl:px-28 pb-6 lg:pb-10 leading-normal"
                >
                  The AI Receptionist You&apos;ve Been 
                  {" "}
                  <Highlight className="text-black dark:text-white leading-normal">
                  Looking For
                  </Highlight>
                </motion.h1>
                <p className="text-xl text-gray-600 px-8 pt-6 lg:px-80 xl:px-20 2xl:px-60">
                Intelligent phone assistance that transforms customer communication with zero hold times and instant resolutions.
                </p>

                
                <div className="mt-16">
                  
                
                    {/* <Button 
                      className="px-6 py-2 mb-10 bold transform hover:-translate-y-1 transition duration-400"
                      onClick={() => setShowDialog(true)}
                    >
                      Get access
                    </Button> */}
                 

                  <div className="flex flex-row md:items-center justify-center w-full">
                    <AnimatedTooltip items={people} />
                    <p className="mt-4 md:mt-0 pl-8 text-xs md:text-sm">
                      Join <span className="font-semibold">50+ Business Owners</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-1 pt-40 pb-40 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full bg-blue-800 min-h-[500px] lg:min-h-[300px]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Instant Customer Connection
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
          Engage customers immediately with AI-powered communication that never sleeps.
          </p>
        </div>
        <Image
          src="/img-2.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-blue-600">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
        Effortless Scaling
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
        Grow your support without growing your team, handling unlimited calls simultaneously.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Performance at a Glance
          </h2>
          <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Real-time analytics revealing exactly how your customer interactions drive business success.
          </p>
        </div>
        <Image
          src="/img-3.webp"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-12 -bottom-14 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
                </div>
              </div>

              {/* Optional image section for larger screens */}
              {/* 
              <div className="hidden lg:block md:w-1/2">
                <div className="relative">
                  <Image
                    src="/images/shape/shape-01.png"
                    alt="shape"
                    width={46}
                    height={246}
                    className="absolute -left-11.5 top-0"
                  />
                  <Image
                    src="/images/shape/shape-02.svg"
                    alt="shape"
                    width={36.9}
                    height={36.7}
                    className="absolute bottom-0 right-0 z-10"
                  />
                  <Image
                    src="/images/shape/shape-03.svg"
                    alt="shape"
                    width={21.64}
                    height={21.66}
                    className="absolute -right-6.5 bottom-0 z-1"
                  />
                  <div className="relative aspect-[700/444] w-full">
                    <Image
                      className="shadow-solid-l dark:hidden"
                      src="/images/hero/hero-light.svg"
                      alt="Hero"
                      fill
                    />
                    <Image
                      className="hidden shadow-solid-l dark:block"
                      src="/images/hero/hero-dark.svg"
                      alt="Hero"
                      fill
                    />
                  </div>
                </div>
              </div>
              */}
            </div>
           
          </HeroHighlight>
        </div>
      </section>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Great to see you joining us!</DialogTitle>
            <DialogDescription className="">
            <br/>
              We&apos;ll notify you when you&apos;ve got access:
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
  );
};

export default Hero;
