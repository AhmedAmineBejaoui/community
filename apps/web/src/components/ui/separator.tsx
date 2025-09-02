import * as React from "react"
import { cn } from "@/lib/utils"

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("my-2 h-px w-full border-none bg-slate-200", className)} {...props} />
}
