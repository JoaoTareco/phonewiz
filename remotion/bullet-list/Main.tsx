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

const styles: Record<string, React.CSSProperties> = {
  flexContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center'
  }
};

export const BulletList = ({ title, video1}: z.infer<typeof ReadCaptionProps>) => {

  const titleStyle: React.CSSProperties = useMemo(() => {
    return { fontFamily, fontSize: 60 , color: "#fff"};
  }, []);

  return (
    <AbsoluteFill style={container}>
      <Sequence from={0} durationInFrames={180}>
      <OffthreadVideo src={video1} />
      </Sequence>
      <Sequence from={0} durationInFrames={180}>
        <TextFade>
          <div style={styles.flexContainer} ><h1 style={titleStyle}>{title}</h1></div>
        </TextFade>
      </Sequence>
    </AbsoluteFill>
  );
};
