import { z } from "zod";
export const COMP_NAME = "read-caption";

export const CompositionProps = z.object({
  title: z.string(),
  video1: z.string(),
  video2: z.string().optional(),
  readCap: z.string().optional(),
  selectedFont: z.any(),
  fontColour: z.any(),
  backgroundColour: z.any()
});

export const ReadCaptionProps = z.object({
  title: z.string(),
  video1: z.string(),
  video2: z.string(),
  readCap: z.string(),
  selectedFont: z.any(),
  fontColour: z.any(),
  backgroundColour: z.any()
});

export const defaultMyCompProps: z.infer<typeof ReadCaptionProps> = {
  title: "Default",
  readCap: "Default",
  selectedFont: "Montserrat",
  fontColour: "#ffffff",
  backgroundColour: "Transparent",
  video1: "",
  video2: "",
};

export const DURATION_IN_FRAMES = 180;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;


export const importFont = async (fontName: string) => {
  const importName = fontName;

  switch (importName) {
    case 'Inter':
      return await import("@remotion/google-fonts/Inter");
    case 'Kanit':
      return await import("@remotion/google-fonts/Kanit");
    case 'Lato':
      return await import("@remotion/google-fonts/Lato");
    case 'Lora':
      return await import("@remotion/google-fonts/Lora");
    case 'Merriweather':
      return await import("@remotion/google-fonts/Merriweather");
    case 'Montserrat':
      return await import("@remotion/google-fonts/Montserrat");
    case 'Noto Sans':
      return await import("@remotion/google-fonts/NotoSans");
    case 'Noto Sans JP':
      return await import("@remotion/google-fonts/NotoSansJP");
    case 'Noto Sans KR':
      return await import("@remotion/google-fonts/NotoSansKR");
    case 'Noto Sans TC':
      return await import("@remotion/google-fonts/NotoSansTC");
    case 'Nunito':
      return await import("@remotion/google-fonts/Nunito");
    case 'Nunito Sans':
      return await import("@remotion/google-fonts/NunitoSans");
    case 'Open Sans':
      return await import("@remotion/google-fonts/OpenSans");
    case 'Oswald':
      return await import("@remotion/google-fonts/Oswald");
    case 'PT Sans':
      return await import("@remotion/google-fonts/PTSans");
    case 'Playfair Display':
      return await import("@remotion/google-fonts/PlayfairDisplay");
    case 'Poppins':
      return await import("@remotion/google-fonts/Poppins");
    case 'Raleway':
      return await import("@remotion/google-fonts/Raleway");
    case 'Roboto':
      return await import("@remotion/google-fonts/Roboto");
    case 'Roboto Condensed':
      return await import("@remotion/google-fonts/RobotoCondensed");
    case 'Roboto Mono':
      return await import("@remotion/google-fonts/RobotoMono");
    case 'Roboto Slab':
      return await import("@remotion/google-fonts/RobotoSlab");
    case 'Rubik':
      return await import("@remotion/google-fonts/Rubik");
    case 'Ubuntu':
      return await import("@remotion/google-fonts/Ubuntu");
    case 'Work Sans':
      return await import("@remotion/google-fonts/WorkSans");
    case undefined:
      return await import("@remotion/google-fonts/Rubik");
    default:
      return await import("@remotion/google-fonts/Rubik");
  }
};