import React, { useCallback, useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { top25 } from "@/lib/fonts/fonts";
import { GradientPicker } from "./gradient-picker";
import { set } from "zod";
 
type FontPickerProps = {
  setProps: any;
};

const preloadFonts = async () => {
  try {
    // await Promise.all(top25.map(font => font.load()));
    // console.log('All fonts have been preloaded.');
    // const [handle] = useState(() => delayRender());

    top25.forEach(async (font) => {
      // Load font information
      const loaded = await font.load();

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

export const FontPicker: React.FC<FontPickerProps> = ({ setProps }) => {
  const [background, setBackground] = useState('Transparent')
  const [font, setFont] = useState('#ffffff')
  const [selectedFont, setSelectedFont] = useState('')

  const newFonts = top25;
 
  const onChange = useCallback(
    async (value: string) => {
      const fonts = newFonts.find((f) => f.family === value);
 
      if (fonts) {
        const loaded = await fonts.load();
        const { fontFamily } = loaded.loadFont();
        setSelectedFont(fontFamily);
        setProps({ selectedFont: fontFamily, fontColour: font, backgroundColour: background });
      }
    },
    [newFonts, font, background, setProps],
  );

  useEffect(() => {
    setProps({ selectedFont, fontColour: font, backgroundColour: background });
  }, [selectedFont, font, background, setProps]);
 
  return (
    <div className="grid grid-cols-2 pb-5">
      <div className="col-span-1 pr-4">
        <Select onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent className="overflow-y-auto max-h-[15rem]">
          {newFonts.map((f) => (
            <SelectItem key={f.family} value={f.family} style={{ fontFamily: f.family }}>{f.family}</SelectItem>
          ))}
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-1">      
        <GradientPicker
          className=""
          font={font}
          setFont={setFont}
          background={background}
          setBackground={setBackground}
        />
      </div>
    </div>
  );
};