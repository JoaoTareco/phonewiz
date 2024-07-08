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
import { ReadCaptionProps, importFont } from "../../lambda/types/constants";
import React, { useCallback, useEffect, useMemo } from "react";
import { TextFade } from "./TextFade";


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

export const BulletList = ({ title, video, selectedFont, fontColour, backgroundColour}: z.infer<typeof ReadCaptionProps>) => {

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
      <Sequence from={0} durationInFrames={180}>
      <AbsoluteFill>
        <TextFade>
          <div style={styles.flexContainer} ><h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '95%'}}>{title}</h1></div>
        </TextFade>
        <OffthreadVideo src={video[0]} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
