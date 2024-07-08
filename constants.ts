import { Wallet, ImageIcon, Film, Music, StickyNote } from "lucide-react";

export const MAX_FREE_COUNTS = 5;

export const tools = [
  {
    label: 'Unlimited posts per month',
    icon: StickyNote,
    href: '/post-generator',
    color: "text-gray-700",
    bgColor: "bg-gray-700/10",
  },
  {
    label: '60 video renders per month',
    icon: Film,
    href: '/post-generator',
    color: "text-gray-700",
    bgColor: "bg-gray-700/10",
  },
  {
    label: 'Price will forever be 9,99€ for you',
    icon: Wallet,
    color: "text-gray-700",
    bgColor: "bg-gray-700/10",
    href: '/post-generator',
  },
  // {
  //   label: 'Video Generation',
  //   icon: VideoIcon,
  //   color: "text-orange-700",
  //   bgColor: "bg-orange-700/10",
  //   href: '/video',
  // },
  // {
  //   label: 'Code Generation',
  //   icon: Code,
  //   color: "text-green-700",
  //   bgColor: "bg-green-700/10",
  //   href: '/code',
  // },
];
