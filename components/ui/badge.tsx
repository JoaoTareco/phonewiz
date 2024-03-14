import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        premium: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-primary-foreground border-0",
        high:
          "border-transparent bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FFCBCB]/80",
        medium:
          "border-transparent bg-[#FEFCE8] text-[#A16207] hover:bg-[#FFF8B1]/80",
        medium2:
          "border-transparent bg-[#f2f6ff] text-[#004bed] hover:bg-[#cadafc]/80",
        low:
          "border-transparent bg-[#F0FDF4] text-[#047857] hover:bg-[#C8FFD9]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
