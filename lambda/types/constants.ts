import { z } from "zod";
export const COMP_NAME = "read-caption";

export const CompositionProps = z.object({
  title: z.string(),
  video: z.string(),
});

export const ReadCaptionProps = z.object({
  title: z.string(),
  video1: z.string(),
  video2: z.string(),
  readCap: z.string(),
  selectedFont: z.string()
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
  video: "https://modtrxtmhwxwnywspfuf.supabase.co/storage/v1/object/public/content-bank/user_2aPY12uVo8oyqxKieBV7qpNOgOJ/IMG_2200.mp4",
};

export const DURATION_IN_FRAMES = 180;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;
