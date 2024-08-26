"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const Video = () => {
  return (
    <>
    {/* https://youtu.be/l_9Htzl-bW0 */}
      <section className="overflow-hidden pb-20 pt-20 lg:pb-25 xl:pb-30 px-20">
        <div className="px-4 md:px-8 xl:px-8 flex justify-center rounded-md">
        <iframe width="775" height="472,5" src="https://www.youtube.com/embed/o5qdjdJXt5M?si=2IPbQ0e-ojiuwRdV?rel=0&controls=0&showinfo=0&modestbranding=1" title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen

        className="rounded-xl border-2 border-l-neutral-200 shadow-sm"></iframe>
        </div>
      </section>
    </>
  );
};

export default Video;
