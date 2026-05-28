import type { HTMLAttributes } from "react";

import { cn } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-lg border border-white/10 bg-white/[0.055] shadow-glow backdrop-blur", className)}
      {...props}
    />
  );
}
