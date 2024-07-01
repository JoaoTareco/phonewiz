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
      <OffthreadVideo src={'https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/user_2aPY12uVo8oyqxKieBV7qpNOgOJ/2022-03-29 15.50.40 2804691509773893389_51580555498.mp4'} />
      </Sequence>
      <Sequence from={0} durationInFrames={180}>
        <TextFade>
          <div style={styles.flexContainer} ><h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '95%'}}>{title}</h1></div>
        </TextFade>
      </Sequence>
    </AbsoluteFill>
  );
};
