import * as React from "react"
import { cn } from "../../lib/utils"

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" }) {
  const styles = variant === "secondary"
    ? "bg-slate-100 text-slate-700"
    : "bg-indigo-600 text-white"
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", styles, className)} {...props} />
  )
}
