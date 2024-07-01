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

export const Main = ({ title, video, readCap="Read Caption ↓" }: z.infer<typeof CompositionProps>) => {
 
  const titleStyle: React.CSSProperties = useMemo(() => {
    return { fontFamily, fontSize: 70 , color: "#fff"};
  }, []);

  return (
    <AbsoluteFill style={container}>

        <TextFade>
          <div className="flex justify-center h-full text-center" ><h1 style={titleStyle}>{title}</h1></div>
        </TextFade>
        
           <OffthreadVideo src={'https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/user_2aPY12uVo8oyqxKieBV7qpNOgOJ/2022-03-29 15.50.40 2804691509773893389_51580555498.mp4'} />

    </AbsoluteFill>
  );
};
