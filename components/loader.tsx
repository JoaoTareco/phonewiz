import Image from "next/image"
import { Loader2 } from 'lucide-react';

export const Loader = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="animate-spin">
        <Loader2 size={64}  absoluteStrokeWidth />
      </div>
    </div>
  );
};
