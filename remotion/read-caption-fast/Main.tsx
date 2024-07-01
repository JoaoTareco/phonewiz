import { z } from "zod";
import {
  AbsoluteFill,
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
import { TextCenter } from "./TextCenter";


export const ReadCaptionFast = ({ title, video, readCap="Read Caption ↓", selectedFont, fontColour, backgroundColour }: z.infer<typeof ReadCaptionProps>) => {


  let styles: Record<string, React.CSSProperties> = {
    flexContainer: {
      display: 'flex',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
      padding: 10,
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
        <TextCenter>
          <div style={styles.flexContainer} >
              <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '95%'}}>{title}</h1>
              </div>
        </TextCenter>
        
           <OffthreadVideo src={video[0]} />
      </Sequence>
      <Sequence from={90} durationInFrames={15}>
      <TextCenter>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '100%'}}>{readCap}</h1>
          </div>
          </TextCenter>
           <OffthreadVideo src={video[1]} />
      </Sequence>
      <Sequence from={105} durationInFrames={15}>
      <TextCenter>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '100%'}}>{readCap}</h1>
          </div>
          </TextCenter>
           <OffthreadVideo src={video[2]} />
      </Sequence>
      <Sequence from={120} durationInFrames={15}>
      <TextCenter>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '100%'}}>{readCap}</h1>
          </div>
          </TextCenter>
        
           <OffthreadVideo src={video[3]} />
      </Sequence>
      <Sequence from={135} durationInFrames={15}>

      <TextCenter>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '100%'}}>{readCap}</h1>
          </div>
          </TextCenter>
           <OffthreadVideo src={video[4]} />
      </Sequence>
   
 
    </AbsoluteFill>
  );
};
