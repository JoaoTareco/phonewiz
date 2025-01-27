"use client";
import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <div
      className={cn(
        "relative flex items-center bg-white dark:bg-black justify-center w-full group",
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-dot-thick-neutral-100 dark:bg-dot-thick-neutral-100 pointer-events-none" />
      
      {/* Arch gradient effect - Base layer */}
      <motion.div
        className="pointer-events-none bg-dot-thick-blue-500 dark:bg-dot-thick-blue-400 absolute inset-0"
        animate={{
          opacity: [0.2, 0.9, 1, 0.9, 0.2]
        }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        style={{
          WebkitMaskImage: `
            radial-gradient(
              300px circle at 0% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              250px circle at 20% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              200px circle at 40% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              200px circle at 60% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              250px circle at 80% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              300px circle at 100% 0%,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: `
            radial-gradient(
              300px circle at 0% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              250px circle at 20% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              200px circle at 40% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              200px circle at 60% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              250px circle at 80% 0%,
              black 0%,
              transparent 100%
            ),
            radial-gradient(
              300px circle at 100% 0%,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Left edge wave */}
      <motion.div
        className="pointer-events-none bg-dot-thick-blue-500 dark:bg-dot-thick-blue-400 absolute inset-0"
        animate={{
          opacity: [0.1, 0.95, 0.1]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut",
        }}
        style={{
          WebkitMaskImage: `radial-gradient(300px circle at 0% 0%, black 0%, transparent 100%)`,
          maskImage: `radial-gradient(300px circle at 0% 0%, black 0%, transparent 100%)`,
        }}
      />

      {/* Right edge wave */}
      <motion.div
        className="pointer-events-none bg-dot-thick-blue-500 dark:bg-dot-thick-blue-400 absolute inset-0"
        animate={{
          opacity: [0.1, 0.95, 0.1]
        }}
        transition={{
          repeat: Infinity,
          duration: 2.2,
          ease: "easeInOut",
          delay: 0.5
        }}
        style={{
          WebkitMaskImage: `radial-gradient(300px circle at 100% 0%, black 0%, transparent 100%)`,
          maskImage: `radial-gradient(300px circle at 100% 0%, black 0%, transparent 100%)`,
        }}
      />

      {/* Center waves */}
      <motion.div
        className="pointer-events-none bg-dot-thick-blue-500 dark:bg-dot-thick-blue-400 absolute inset-0"
        animate={{
          opacity: [0.1, 0.8, 0.1]
        }}
        transition={{
          repeat: Infinity,
          duration: 2.8,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          WebkitMaskImage: `
            radial-gradient(250px circle at 30% 0%, black 0%, transparent 100%),
            radial-gradient(250px circle at 70% 0%, black 0%, transparent 100%)
          `,
          maskImage: `
            radial-gradient(250px circle at 30% 0%, black 0%, transparent 100%),
            radial-gradient(250px circle at 70% 0%, black 0%, transparent 100%)
          `,
        }}
      />

      {/* Existing hover effect */}
      <motion.div
        className="pointer-events-none bg-dot-thick-blue-700 dark:bg-dot-thick-blue-700 absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              150px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />

      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.span
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={{
        backgroundSize: "100% 100%",
      }}
      transition={{
        duration: 2,
        ease: "linear",
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        `relative inline-block pb-0  px-1 rounded-xl bg-gradient-to-r from-[#D2E5FF] to-[#D8E9FF]`,
        className
      )}
    >
      {children}
    </motion.span>
  );
};
