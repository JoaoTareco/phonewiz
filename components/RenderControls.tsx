import { z } from "zod";
import { useRendering } from "../helpers/use-rendering";
import { COMP_NAME, CompositionProps, ReadCaptionProps } from "../lambda/types/constants";
import { AlignEnd } from "./remotion/AlignEnd";
import { ButtonRe } from "./remotion/Button/Button";
import { InputContainer } from "./remotion/Container";
import { DownloadButton } from "./DownloadButton";
import { ErrorComp } from "./remotion/Error";
import { Input } from "./ui/input";
import { ProgressBar } from "./ProgressBar";
import { Spacing } from "./Spacing";
import { ChangeEvent, useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { FontPicker } from "./fontPicker";
import { Label } from "./ui/label";

export const RenderControls: React.FC<{
  setInputProps: React.Dispatch<React.SetStateAction<any>>;
  inputProps: z.infer<typeof CompositionProps>;
  videos: string[];
  video_template: string | any;
}> = ({ setInputProps, inputProps, videos, video_template }) => {
  
  let composition = "universal";
  
  const { renderMedia, state, undo } = useRendering(composition, inputProps);
  const [selectedVideo, setSelectedVideo] = useState<string>();

  const videoUrls = videos;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const { value } = e.target;
    setInputProps((prevProps: any) => {
      const updatedProps = { ...prevProps };
      if (key === 'hook') {
        // Update the text in textSequences
        updatedProps.textSequences = [
          {
            ...updatedProps.textSequences[0],
            content: value
          }
        ];
      } else {
        updatedProps[key] = value;
      }
      return updatedProps;
    });
  };

  const handleVideoChange = (url: string | undefined, index: number ) => {
    setInputProps((prevProps: any) => {
      const updatedVideoSequences = [...prevProps.videoSequences];
      updatedVideoSequences[index] = {
        ...updatedVideoSequences[index],
        video: url
      };
      return { ...prevProps, videoSequences: updatedVideoSequences };
    });
  };

  const handleFontChange = (newProps: any) => {
    setInputProps((prevProps: any) => {
      const updatedTextSequences = prevProps.textSequences.map((seq: any) => ({
        ...seq,
        font: newProps.selectedFont,
        color: newProps.fontColour,
        backgroundColor: newProps.backgroundColour
      }));
      return { ...prevProps, textSequences: updatedTextSequences };
    });
  };

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
          {/* Text input for the hook */}
          <div className="mb-5">
            <Label htmlFor="hook">Hook Text</Label>
            <Input
              id="hook"
              disabled={state.status === "invoking"}
              value={inputProps.textSequences?.[0]?.content || ''}
              onChange={(e) => handleInputChange(e, 'hook')}
              placeholder="Enter video text (hook)"
              className="mt-1"
            />
          </div>

          {/* Font Picker */}
          <div className="mb-5">
            <Label>Font and Colors</Label>
            <FontPicker setProps={handleFontChange} />
          </div>

          {/* Video selection */}
          {inputProps.videoSequences?.map((video: any, index: number) => (
            <div key={index} className="mb-5">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Change Video {index + 1}</Button>
                </SheetTrigger>
                <SheetContent side={"bottom"}>
                  <SheetHeader>
                    <SheetTitle>Change Video</SheetTitle>
                    <SheetDescription>
                      {videoUrls.length > 0 && <p>Choose another video for this segment.</p>}
                      {videoUrls.length === 0 && <p>Please add videos to your content bank to change this video.</p>}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="relative">
                    <ScrollArea>
                      <div className="flex space-x-4 pb-4 pt-5">
                        {videoUrls.map((videoUrl, videoIndex) => (
                          <video
                            key={videoIndex}
                            className={`h-64 w-42 object-cover transition-all hover:scale-95 aspect-[3/4] rounded-md border-2 ${selectedVideo === videoUrl ? 'border-red-400' : 'border-transparent'} cursor-pointer`}
                            controls={false}
                            preload="metadata"
                            onMouseOver={event => (event.target as HTMLMediaElement).play()}
                            onMouseOut={event => (event.target as HTMLMediaElement).pause()}
                            muted
                            onClick={() => setSelectedVideo(videoUrl)}
                          >
                            <source src={videoUrl} />
                          </video>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit" onClick={() => handleVideoChange(selectedVideo, index)}>Save changes</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          ))}

          <div className="flex justify-start">
            <ButtonRe
              disabled={state.status === "invoking"}
              loading={state.status === "invoking"}
              onClick={renderMedia}
            >
              Render video
            </ButtonRe>
          </div>
          <Spacing></Spacing>
          {state.status === "error" ? (
            <ErrorComp message={state.error.message}></ErrorComp>
          ) : null}
        </>
      ) : null}
      {state.status === "rendering" || state.status === "done" ? (
        <>
          <ProgressBar
            progress={state.status === "rendering" ? state.progress : 1}
          />
          <Spacing></Spacing>
          <AlignEnd>
            <DownloadButton undo={undo} state={state}></DownloadButton>
          </AlignEnd>
          <Spacing></Spacing>
        </>
      ) : null}
    </InputContainer>
  );
};