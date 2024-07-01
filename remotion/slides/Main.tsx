import { z } from "zod";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence
} from "remotion";
import { ReadCaptionProps, importFont } from "../../lambda/types/constants";
import React, { useCallback, useEffect, useMemo } from "react";
import { TextFade } from "./TextFade";
import { TextCenter } from "../read-caption-fast/TextCenter";


const container: React.CSSProperties = {
  backgroundColor: "gray",
};

const styles: Record<string, React.CSSProperties> = {
  flexContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: 10
  }
};

export const Slides = ({ title, text, video, selectedFont, fontColour, backgroundColour}: z.infer<typeof ReadCaptionProps>) => {

  const fetchData = useCallback(async () => {
    await importFont(selectedFont);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  

  return (
    <AbsoluteFill style={{
      fontFamily: selectedFont,
    }}>
      <Sequence from={0} durationInFrames={90}>
        <TextFade>
          <div style={styles.flexContainer} >
              <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '95%'}}>{title}</h1>
              </div>
        </TextFade>
        
           <OffthreadVideo src={video[0]} />
      </Sequence>
      <Sequence from={90} durationInFrames={20}>
        <TextCenter>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '100%'}}>{"test"}</h1>
          </div>
        </TextCenter>
        
           <OffthreadVideo src={video[1]} />
      </Sequence>
      <Sequence from={110} durationInFrames={20}>
        <TextCenter>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '100%'}}>{"test2"}</h1>
          </div>
        </TextCenter>
        
           <OffthreadVideo src={video[2]} />
      </Sequence>
      <Sequence from={130} durationInFrames={20}>
        <TextCenter>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '100%'}}>{"test3"}</h1>
          </div>
        </TextCenter>
        
           <OffthreadVideo src={video[3]} />
      </Sequence>
      <Sequence from={150} durationInFrames={20}>
        <TextCenter>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '100%'}}>{"test2"}</h1>
          </div>
        </TextCenter>
        
           <OffthreadVideo src={video[4]} />  
      </Sequence>
      <Sequence from={170} durationInFrames={20}>
        <TextCenter>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '100%'}}>{"test2"}</h1>
          </div>
        </TextCenter>
        
           <OffthreadVideo src={video[5]} />
      </Sequence>
    </AbsoluteFill>
  );
};
