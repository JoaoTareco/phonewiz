import { z } from "zod";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  Video,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ReadCaptionProps } from "../../lambda/types/constants";
import { loadFont, fontFamily } from "@remotion/google-fonts/Montserrat";
import React, { useMemo } from "react";
import { TextFade } from "./TextFade";
 


loadFont();

const container: React.CSSProperties = {
  backgroundColor: "gray",
};

export const ReadCaption = ({ title, video1, video2, readCap="Read Caption ↓" }: z.infer<typeof ReadCaptionProps>) => {

  const titleStyle: React.CSSProperties = useMemo(() => {
    return { fontFamily, fontSize: 60 , color: "#fff"};
  }, []);

  return (
    <AbsoluteFill style={container}>
      <Sequence from={0} durationInFrames={90}>
        <TextFade>
          <div className="flex justify-center h-full text-center" ><h1 style={titleStyle}>{title}</h1></div>
        </TextFade>
        
           <OffthreadVideo src={video1} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <TextFade>
          <div className="flex justify-center h-full text-center" ><h1 style={titleStyle}>{readCap}</h1></div>
        </TextFade>
        
           <OffthreadVideo src={video2} />
      </Sequence>
    </AbsoluteFill>
  );
};
