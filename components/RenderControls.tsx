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
// import { Label } from "./ui/label";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { FontPicker } from "./fontPicker";

export const RenderControls: React.FC<{
  setInputProps: React.Dispatch<React.SetStateAction<any>>;
  inputProps: z.infer<typeof CompositionProps>;
  videos: string[];
  video_template: string | any;
}> = ({ setInputProps, inputProps, videos, video_template }) => {
  
  let composition = "read-caption";
  
  if (video_template === "Read caption"){
    inputProps.video = inputProps.video.slice(0, 2);
  }
  else if (video_template === "Single clip with hook") {
    composition = "bullet-list"
    // delete inputProps.video2;
    inputProps.video = inputProps.video.slice(0, 1);
    delete inputProps.readCap;
  } else if (video_template === "Slides") {
    composition = "slides"
    inputProps.video = inputProps.video.slice(0, 5);
  }

  const { renderMedia, state, undo } = useRendering(composition, inputProps);
  const [selectedVideo, setSelectedVideo] = useState<string>();
  const [fontFamilyChosen, setFontFamily] = useState<any>();

  // const videoCount: number = Object.keys(inputProps).filter(key => key.startsWith('video')).length;
  // const textCount: number = Object.keys(inputProps).filter(key => key.startsWith('title')).length;

  // const videosArray = Object.entries(videos).map(([name, url]) => ({ name, url: { video: url} }));

  // const videoUrls = Object.values(videos).map(videoObj => videoObj.video);

  const videoUrls = videos

  useEffect(() => {
    setInputProps((prevProps: any) => ({ ...prevProps, selectedFont: fontFamilyChosen }));
    console.log(inputProps)
  }, [fontFamilyChosen, inputProps, setInputProps]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const { value } = e.target;
    setInputProps((prevProps: any) => ({ ...prevProps, [key]: value }));
  };

  const handleVideoChange = (url: string | undefined, index: number ) => {
    const inputProps_copy = { ...inputProps };
    inputProps_copy.video[index] = url;
    setInputProps(inputProps_copy);
    // setInputProps((prevProps: any) => ({ ...prevProps, [key as any]: url }));
  };

  return (
    <InputContainer>
      {state.status === "init" ||
      state.status === "invoking" ||
      state.status === "error" ? (
        <>
             {Object.entries(inputProps).map(([key, value], index) => {
                if (key.startsWith('title')) {
                  return (
                    <div key={index} className="mb-5">
                      {/* <label htmlFor={key}>{key}</label> */}
                      <Input
                        id={key}
                        disabled={state.status === "invoking"}
                        value={value}
                        onChange={(e) => handleInputChange(e, key)}
                        className=""
                      />
                    </div>
                  );
                } else if (key.startsWith('readCap')) {
                  return (
                    <div key={index} className="mb-5">
                      {/* <label htmlFor={key}>{key}</label> */}
                      <Input
                        id={key}
                        disabled={state.status === "invoking"}
                        value={value}
                        onChange={(e) => handleInputChange(e, key)}
                        className=""
                      />
                    </div>
                  );
                } else if (key.startsWith('video')) {
                  // Assuming you have a dropdown component for videos
                  return (
                    inputProps.video.map((video: any, index1: any) => (
                      <div key={index1} className="mb-5">
                        {/* <label htmlFor={key}>{key}</label>  */}
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline">Change Video {index1+1}</Button>
                          </SheetTrigger>
                          <SheetContent side={"bottom"}>
                            <SheetHeader>
                              <SheetTitle>Change Video</SheetTitle>
                              <SheetDescription>
                                Choose another video for this segment.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="relative">
                            <ScrollArea>
                            <div className="flex space-x-4 pb-4 pt-5">
                            {videoUrls.map((video, index1) => (
                                <video  className={`h-64 w-42 object-cover transition-all hover:scale-95 aspect-[3/4] rounded-md  border-2 ${selectedVideo === video ? 'border-red-400' : 'border-transparent'} cursor-pointer`}
                                    controls={false} 
                                    // autoPlay
                                    onMouseOver={event => (event.target as HTMLMediaElement).play()}
                                    onMouseOut={event => (event.target as HTMLMediaElement).pause()}
                                    muted
                                    key={index1}
                                    onClick={() => setSelectedVideo(video)}
                                    >
                                    <source src={video} type="video/mp4" />
                                  </video>
                            ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                              </ScrollArea>
                            </div>
                            <SheetFooter>
                              <SheetClose asChild>
                                <Button type="submit" onClick={() => handleVideoChange(selectedVideo, index1)}>Save changes</Button>
                              </SheetClose>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
                      </div>
                    ))
                  );
                }
                return null;
              })}
            <FontPicker setProps={setInputProps}/>
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
