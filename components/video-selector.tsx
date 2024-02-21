"use client";

import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Sheet } from './ui/sheet';

export const VideoSelector = ({ videos, selectedVideo, onSelect }) => {
  return (
    <Sheet>
      <ScrollArea horizontal>
        {videos.map((video, index) => (
          <div
            key={index}
            onClick={() => onSelect(video.name)}
            className={`p-2 m-2 border-2 ${selectedVideo === video.name ? 'border-black' : 'border-transparent'} cursor-pointer`}
          >
            {video.name}
          </div>
        ))}
      </ScrollArea>
      <Button onClick={() => BottomSheet.close()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </Button>
    </Sheet>
  );
};
