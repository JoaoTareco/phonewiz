import { z } from "zod";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import { ReadCaptionProps } from "../../lambda/types/constants";
import React from "react";
import { TextFade } from "./TextFade";

interface TextItem {
  id: string;
  type: 'text';
  content: string;
  start: number;
  duration: number;
  x: number;
  y: number;
  font: string;
  color: string;
  backgroundColor: string;
}

interface VideoItem {
  video: string;
  startFrame: number;
  durationInFrames: number;
}


export const Universal = ({ 
  textSequences,
  videoSequences,
}: { 
  textSequences: TextItem[], 
  videoSequences: VideoItem[] 
}) => {
  return (
    <AbsoluteFill>
      {videoSequences.map((seq, index) => (
        <Sequence key={`video-${index}`} from={seq.startFrame} durationInFrames={seq.durationInFrames}>
          <OffthreadVideo src={seq.video} />
        </Sequence>
      ))}
      {textSequences.map((seq, index) => (
        <Sequence key={`text-${index}`} from={seq.start * 30} durationInFrames={seq.duration * 30}>
          <AbsoluteFill>
            <TextFade>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: 20,
                position: 'relative'
              }}>
                <h1 style={{
                  fontFamily: seq.font,
                  fontSize: 60,
                  color: seq.color,
                  backgroundColor: seq.backgroundColor,
                  borderRadius: 30,
                  backgroundSize: "bg-contain",
                  padding: 10,
                }}>{seq.content}</h1>
              </div>
            </TextFade>
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};