import { useEffect, useRef } from "react";

const VideoPlayer: React.FC<{videoUrl: string}> = ({videoUrl}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
   
    useEffect(() => {
       const video = videoRef.current;
       if (video) {
         video.addEventListener('mouseenter', () => video.play());
         video.addEventListener('mouseleave', () => video.pause());
       }
   
       // Cleanup event listeners
       return () => {
         if (video) {
           video.removeEventListener('mouseenter', () => video.play());
           video.removeEventListener('mouseleave', () => video.pause());
         }
       };
    }, []);
   
    return (
       <video ref={videoRef} width="320" height="240" controls preload="metadata">
         <source src={videoUrl}  />
       </video>
    );
   };
   
   export default VideoPlayer;