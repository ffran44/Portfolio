import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const SIZES = {
  sm: { wrapper: "p-2", icon: "h-4 w-4" },
  md: { wrapper: "p-2.5", icon: "h-6 w-6" },
  lg: { wrapper: "p-3", icon: "h-8 w-8" },
} as const

interface IconBadgeProps {
  icon: LucideIcon
  size?: keyof typeof SIZES
  className?: string
}

export function IconBadge({ icon: Icon, size = "md", className }: IconBadgeProps) {
  const { wrapper, icon } = SIZES[size]

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "bg-accent/10 border border-accent/20",
        "shadow-[0_0_16px_-8px_oklch(0.74_0.13_200_/_0.6)]",
        "transition-all duration-300",
        "group-hover:bg-accent/20 group-hover:border-accent/50 group-hover:shadow-[0_0_20px_-4px_oklch(0.74_0.13_200_/_0.7)]",
        wrapper,
        className,
      )}
    >
      <Icon className={cn(icon, "text-accent")} />
    </div>
  )
}
