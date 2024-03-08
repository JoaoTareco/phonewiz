"use client";

import { Cog} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


export const planGenerator = () => {

  return ( 
    <Dialog>
        <DialogTrigger> <Button><Cog className="pr-1"/>Generate</Button></DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
            </DialogDescription>
        </DialogHeader>
        </DialogContent>
    </Dialog>
   );
}
 