"use client";

import axios from "axios";
import { useState } from "react";

import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "./ui/card";
import { Cog, Settings2 } from "lucide-react";

export const SubscriptionButton = ({
  isPro = false
}: {
  isPro: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isPro) {
    return null;
  }

  return (
    <div className="px-3">
    <Card className="bg-white/10 border-0">
      <CardContent className="py-6">
    <Button className="w-full text-sm" variant={isPro ? "default" : "default"} disabled={loading} onClick={onClick} >
      {isPro && <Cog className="w-4 h-4 mr-2" />}
      {isPro ? "Settings" : "Upgrade"}
    </Button>
    </CardContent>
    </Card>
    </div>
  )
};
