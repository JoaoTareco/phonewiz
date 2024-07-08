import { z } from "zod";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  Video,
  continueRender,
  delayRender,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ReadCaptionProps, importFont } from "../../lambda/types/constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TextFade } from "./TextFade";

export const ReadCaption = ({ title, video, readCap="Read Caption ↓", selectedFont, fontColour, backgroundColour }: z.infer<typeof ReadCaptionProps>) => {


  let styles: Record<string, React.CSSProperties> = {
    flexContainer: {
      display: 'flex',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
      padding: 20,
      position: 'relative'  
    }
  };
  

  return (
    <AbsoluteFill  
      style={{
        fontFamily: selectedFont,
      }}
    >
      <Sequence from={0} durationInFrames={90}>
      <AbsoluteFill>
        <TextFade>
          <div style={styles.flexContainer} >
              <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '85%'}}>{title}</h1>
              </div>
        </TextFade>
        
           <OffthreadVideo src={video[0]} />
           </AbsoluteFill>
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
      <AbsoluteFill>
        <TextFade>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '85%'}}>{readCap}</h1>
          </div>
        </TextFade>
        
           <OffthreadVideo src={video[1]} />
           </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
