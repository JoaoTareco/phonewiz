"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("59855e70-8e35-43e1-aa40-dfbfb52799dc");
  }, []);

  return null;
};
