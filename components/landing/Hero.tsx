"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { AnimatedTooltip } from "./ui/tooltip-faces";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import { motion } from "framer-motion";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const Hero = () => {

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
      <section className="overflow-hidden">
        <div className="">
          <HeroHighlight>
            <div className="flex flex-col lg:flex-row lg:items-center  px-4 md:px-20 lg:px-36">
              <div className="text-center">
                <h4 className="mb-2 text-xs md:text-sm text-black dark:text-white font-normal">
                  🔥 In Beta - Get 60% off{" "}
                  <span className="text-neutral-800 font-semibold">forever</span> + 5 free posts
                </h4>
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
                  className="text-4xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold text-neutral-700 mx-auto  md:px-2 lg:px-6 xl:px-18 2xl:px-28 pb-6 lg:pb-10 leading-normal"
                >
                  Create Reels and Tiktoks{" "}
                  <Highlight className="text-black dark:text-white leading-normal">
                    in seconds.
                  </Highlight>
                </motion.h1>
                <p className="text-xl text-gray-600 px-4 lg:px-20 xl:px-20 2xl:px-60">
                  Our AI is trained on hundreds of viral social media captions and hooks, generating the perfect combo every time.
                </p>

                
                <div className="mt-8">

                  <SignedIn>
                  <Link href="/post-generator" >
                  <Button className="px-6 py-2 mb-10 bold transform hover:-translate-y-1 transition duration-400">
                    Go to app
                  </Button>
                  </Link>
                    </SignedIn>
                    <SignedOut>
                    <Link href="/sign-up" >
                  <Button className="px-6 py-2 mb-10 bold transform hover:-translate-y-1 transition duration-400">
                    Get Started
                  </Button>
                  </Link>
                </SignedOut>

                  <div className="flex flex-row md:items-center justify-center w-full">
                    <AnimatedTooltip items={people} />
                    <p className="mt-4 md:mt-0 pl-8 text-xs md:text-sm">
                      Join <span className="font-semibold">132+ content creators</span>
                    </p>
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
    </>
  );
};

export default Hero;
