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
// import { fontFamily,loadFont } from "@remotion/google-fonts/Lobster";

// const container: React.CSSProperties = {
//   backgroundColor: "gray",
// };


// const availableFonts: {
//   fontFamily: string;
//   importName: string;
// }[] = getAvailableFonts();

export const ReadCaption = ({ title, video, readCap="Read Caption ↓", selectedFont, fontColour, backgroundColour }: z.infer<typeof ReadCaptionProps>) => {

  // const titleStyle: React.CSSProperties = useMemo(() => {
  //   return { fontFamily: selectedFont, fontSize: 60 , color: "#fff"};
  // }, []);


  // const fetchData = useCallback(async () => {
  //   await importFont(selectedFont);
  // }, []);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // const [remotionGoogleFont, setRemotionGoogleFont] = useState<any>(null);
  // const [fontFamily, setFontFamily] = useState<any>(selectedFont);

  // const [handle] = useState(() => delayRender());

  // const fetchData = useCallback(async () => {
  //   const googleFont = await importFont(selectedFont);
  //   setRemotionGoogleFont(googleFont);
  //   continueRender(handle);
  // }, []);

  // useEffect(() => {
  //   fetchData();
  // }, []);


  console.log(video[0])
  // useEffect(() => {
  //   async function maybeLoadGoogleFont() {
  //     // const gFont = availableFonts.find(
  //     //   (font) => font.fontFamily === selectedFont
  //     // );

  //     // if (gFont) {
  //       // const googleFont = await import(`@remotion/google-fonts/${gFont.importName}`);
  //       console.log(selectedFont)
  //       const googleFont = await importFont(selectedFont);

  //       console.log(googleFont);
  //       setRemotionGoogleFont(googleFont);

  //       const { waitUntilDone } = googleFont.loadFont("normal", {
  //         weights: ["400"]
  //       });
         
  //       // Optional: Act once the font has been loaded
  //       waitUntilDone().then(() => {
  //         console.log("Font is loaded");
  //         setFontFamily(fontFamily);
  //       });

  //       continueRender(handle);
  //     // }
  //   }
  //   maybeLoadGoogleFont();
  // }, [selectedFont]);


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
        <TextFade>
          <div style={styles.flexContainer} >
              <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '85%'}}>{title}</h1>
              </div>
        </TextFade>
        
           <OffthreadVideo src={video[0]} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <TextFade>
          <div style={styles.flexContainer} >
            <h1 style={{ fontFamily: selectedFont, fontSize: 60 , color: fontColour, backgroundColor: backgroundColour, padding: 10, width: '85%'}}>{readCap}</h1>
          </div>
        </TextFade>
        
           <OffthreadVideo src={video[1]} />
      </Sequence>
    </AbsoluteFill>
  );
};
