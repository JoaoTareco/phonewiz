import { Composition } from "remotion";
import { ReadCaption } from "./read-caption/Main";
import {
  COMP_NAME,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../lambda/types/constants";
import { NextLogo } from "./MyComp/NextLogo";
import { BulletList } from "./bullet-list/Main";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={"bullet-list"}
        component={BulletList}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
       <Composition
        id={"read-caption"}
        component={ReadCaption}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
    </>
  );
};
