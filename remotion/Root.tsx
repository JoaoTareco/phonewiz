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
import {top25} from "../lib/fonts/fonts";
import { BulletList } from "./bullet-list/Main";
import { importFont } from "./fonts";

const preloadFonts = async () => {
  try {
    // await Promise.all(top25.map(font => font.load()));
    // console.log('All fonts have been preloaded.');
    // const [handle] = useState(() => delayRender());

    top25.forEach(async (font) => {
      // Load font information
      const loaded = await importFont(font.family);

      console.log('Loaded font:', font.family);

      // Load the font itself
      await loaded.loadFont("normal", {weights: ["400"]});
    }
    );
    // continueRender(handle);
  } catch (error) {
    console.error('Error preloading fonts:', error);
  }
};

preloadFonts();


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
