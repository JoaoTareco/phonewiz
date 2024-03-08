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
import { NextLogo } from "./NextLogo";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import React, { useMemo } from "react";
import { Rings } from "./Rings";
import { TextFade } from "./TextFade";

loadFont();

const container: React.CSSProperties = {
  backgroundColor: "gray",
};

const logo: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
};

export const ReadCaption = ({ title, video1, video2 }: z.infer<typeof ReadCaptionProps>) => {
 
  const titleStyle: React.CSSProperties = useMemo(() => {
    return { fontFamily: 'latin', fontSize: 70 , color: "#fff"};
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
          <div className="flex justify-center h-full text-center" ><h1 style={titleStyle}>Read Caption ↓</h1></div>
        </TextFade>
        
           <OffthreadVideo src={video2} />
      </Sequence>
    </AbsoluteFill>
  );
};
