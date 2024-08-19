import { Coins, Plus, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { MAX_FREE_COUNTS } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProModal } from "@/hooks/use-pro-modal";
import { Badge } from "./ui/badge";

export const FreeCounter = ({
  isPro = false,
  apiLimitCount = 0,
  boughtTokensCount = 10
}: {
  isPro: boolean,
  apiLimitCount: number,
  boughtTokensCount: number
}) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  

  if (isPro) {
    return null;
  }

  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm mb-4 space-y-2">
          <div className="tooltip tooltip-secondary tooltip-right" data-tip="You can use one token to generate a new post.">
            <p>
              <Badge variant={'secondary'} className="text-sm w-full flex justify-center "><span className="mr-1 text-rose-600  font-bold">{apiLimitCount}</span> Tokens</Badge>
            </p>
          </div>
            {/* <Progress className="h-3" value={(apiLimitCount / boughtTokensCount) * 100} /> */}
          </div>
          <Button onClick={proModal.onOpen} type="submit" className="w-full text-sm">
          Get More <Coins className="w-4 h-4 ml-2"/>
          
          {/* <Plus className="w-4 h-4 ml-2 fill-white"/> */}
            
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}