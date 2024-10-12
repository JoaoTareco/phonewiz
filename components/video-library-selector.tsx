import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Loader } from 'lucide-react';

interface VideoLibrarySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (video: string) => void;
}

const VideoLibrarySelector: React.FC<VideoLibrarySelectorProps> = ({ isOpen, onClose, onSelectVideo }) => {
  const [searchText, setSearchText] = useState('');
  const [videos, setVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchVideos();
    }
  }, [isOpen]);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/get-content');
      setVideos(response.data.all_videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/get-content?search=${searchText}`);
      setVideos(response.data.all_videos);
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const handleSelectVideo = () => {
    if (selectedVideo) {
      onSelectVideo(selectedVideo);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select a Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mb-4">
          <Input 
            type="text" 
            placeholder="Search videos" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {isLoading ? (
            <Button type="submit"><Loader size={20} className="animate-spin"/></Button>
          ) : (
            <Button type="submit"><Search size={20}/></Button>
          )}
        </form>
        <ScrollArea className="flex-grow w-full rounded-md border p-4">
          {isLoading ? (
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 md:grid-cols-2 gap-4 max-w-fit">
              {Array(20).fill(0).map((_, index) => (
                <Skeleton 
                  key={index}
                  className="h-64 w-44 rounded-md" 
                />
              ))}
            </div>
          ) : (
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 md:grid-cols-2 gap-4 max-w-fit">
              {videos.map((videoUrl, index) => (
                <div key={index} className={`${selectedVideo === videoUrl ? 'border-primary border-2 rounded-lg' : ''}`}>
                  <video 
                    className="h-64 w-44 object-cover transition-all aspect-[3/4] rounded-md cursor-pointer" 
                    controls={true}
                    preload="auto"
                    muted
                    onClick={() => handleVideoClick(videoUrl)}
                  >
                    <source src={videoUrl} />
                  </video>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSelectVideo} disabled={!selectedVideo}>
            Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoLibrarySelector;