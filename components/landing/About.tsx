"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const About = () => {
  return (
    <>
      {/* <!-- ===== About Start ===== --> */}
      <section className="overflow-hidden pb-20 pt-20 lg:pb-25 xl:pb-30 px-20 mx-auto w-5/6">
        <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-8">
          <div className="flex items-center gap-16 lg:gap-32.5">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: -20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left relative mx-auto hidden  md:block md:w-1/2"
            >
              <Image
                src="/about-3.png"
                alt="About"
                className="dark:hidden shadow-sm rounded-lg border border-neutral-50"
                width={1200}
                height={1200}
              
              />
              <Image
                src=""
                alt="About"
                className="hidden dark:block"
                fill
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: 20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_right md:w-1/2"
            >
              {/* <span className="font-medium uppercase text-black dark:text-white">
                <span className="mb-4 mr-4 inline-flex rounded-full bg-meta px-4.5 py-1 text-metatitle uppercas ">
                  New
                </span>{" "}
                SaaS Boilerplate for Next.js
              </span> */}
              <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
                A <span className="text-primary">faster</span> way to create content
        
              </h2>
              {/* <p>
                Create new posts or captions in 3 simple steps:
              </p> */}

              <div className="mt-7.5 flex items-center gap-5 py-2">
                <div className="flex h-15 w-15 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                  <p className="text-metatitle2 font-semibold text-black dark:text-white px-2">
                    1
                  </p>
                </div>
                <div className="w-3/4">
                  <h3 className="mb-0.5 text-md text-black dark:text-white">
                    Give a topic, target audience and CTA.
                  </h3>
                  <p className="text-sm">Give also personal insights you have about the topic so it is still personal.</p>
                </div>
              </div>
              <div className="mt-7.5 flex items-center gap-5 py-2">
                <div className="flex h-15 w-15 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                  <p className="text-metatitle2 font-semibold text-black dark:text-white px-2">
                    2
                  </p>
                </div>
                <div className="w-3/4">
                  <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                    Choose a hook, caption and post formats.
                  </h3>
                  <p className="text-sm"> Do you want to tell a story? Or do you want to create an &quot;How To&quot; guide?</p>
                </div>
              </div>
              <div className="mt-7.5 flex items-center gap-5 py-2">
                <div className="flex h-15 w-15 items-center justify-center rounded-[50%] border border-stroke dark:border-strokedark dark:bg-blacksection">
                  <p className="text-metatitle2 font-semibold text-black dark:text-white px-2">
                    3
                  </p>
                </div>
                <div className="w-3/4">
                  <h3 className="mb-0.5 text-metatitle2 text-black dark:text-white">
                    View your generated post... and publish!
                  </h3 >
                  <p className="text-sm">Make any final edits you need to the video or caption, or just publish. </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* <!-- ===== About End ===== --> */}

      {/* <!-- ===== About Two Start ===== --> */}
      <section className="overflow-hidden pb-20 pt-20 lg:pb-25 xl:pb-30 px-20 mx-auto w-5/6">
        <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-8">
          <div className="flex items-center gap-16 lg:gap-32.5">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: -20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left md:w-1/2 flex flex-col justify-center"
            >
              <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
                Content that is still  <span className="text-primary">personal</span>
              </h2>
              <p>
                Create new posts with your own clips by uploading them to your content bank or choose from the hundreds of high quality clips available in the library.
              </p>
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: 20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_right relative mx-auto hidden aspect-[588/526.5] md:block md:w-1/2"
            >
              <Image
                src="/about-4.jpeg"
                alt="About"
                className="dark:hidden shadow-sm rounded-lg border border-neutral-50"
                width={860}
                height={783}
              />
              <Image
                src=""
                alt="About"
                className="hidden dark:block"
                width={860}
                height={783}
              />
            </motion.div>
          </div>
        </div>
      </section>
      {/* <!-- ===== About Two End ===== --> */}
    </>
  );
};

export default About;
