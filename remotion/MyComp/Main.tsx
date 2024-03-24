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
import { CompositionProps } from "../../lambda/types/constants";
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

export const Main = ({ title, video1, video2, readCap="Read Caption ↓" }: z.infer<typeof CompositionProps>) => {
 
  const titleStyle: React.CSSProperties = useMemo(() => {
    return { fontFamily, fontSize: 70 , color: "#fff"};
  }, []);

  return (
    <AbsoluteFill style={container}>

        <TextFade>
          <div className="flex justify-center h-full text-center" ><h1 style={titleStyle}>{title}</h1></div>
        </TextFade>
        
           <OffthreadVideo src={video1} />

    </AbsoluteFill>
  );
};
