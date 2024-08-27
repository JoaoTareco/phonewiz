"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const Video = () => {
  return (
    <>
    {/* https://youtu.be/l_9Htzl-bW0 */}
      <section className="overflow-hidden pb-20 pt-20 lg:pb-25 xl:pb-30 ">
        <div className="px-6 md:px-8 xl:px-8 flex justify-center rounded-md">
        <iframe src="https://www.youtube.com/embed/o5qdjdJXt5M?si=2IPbQ0e-ojiuwRdV?rel=0&controls=0&showinfo=0&modestbranding=1" title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen

        className="h-[30vh] sm:h-[50vh] w-[82vh] rounded-xl border-2 border-l-neutral-200 shadow-sm"></iframe>
        </div>
      </section>
    </>
  );
};

export default Video;
