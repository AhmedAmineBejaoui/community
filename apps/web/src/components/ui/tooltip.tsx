"use client"
import * as React from "react"
import { cn } from "../../lib/utils"

const TooltipCtx = React.createContext<{ delay: number } | null>(null)
export function TooltipProvider({ delayDuration = 200, children }: { delayDuration?: number; children: React.ReactNode }) {
  return <TooltipCtx.Provider value={{ delay: delayDuration }}>{children}</TooltipCtx.Provider>
}

const ItemCtx = React.createContext<{
  open: boolean
  setOpen: (v: boolean) => void
} | null>(null)

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return <ItemCtx.Provider value={{ open, setOpen }}>{children}</ItemCtx.Provider>
}

export function TooltipTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(ItemCtx)
  const provider = React.useContext(TooltipCtx)
  if (!ctx) throw new Error("TooltipTrigger must be used within <Tooltip>")
  const { open, setOpen } = ctx
  const delay = provider?.delay ?? 200
  let timer: any

  const props = {
    onMouseEnter: () => {
      timer = setTimeout(() => setOpen(true), delay)
    },
    onMouseLeave: () => {
      clearTimeout(timer)
      setOpen(false)
    },
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props)
  }
  return (
    <button type="button" {...props} className="inline-flex">
      {children}
    </button>
  )
}

export function TooltipContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(ItemCtx)
  if (!ctx) throw new Error("TooltipContent must be used within <Tooltip>")
  const { open } = ctx
  return (
    <div className={cn("relative inline-block")}> 
      {open && (
        <div className={cn(
          "absolute z-40 mt-2 max-w-xs rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-md",
          className
        )}>
          {children}
        </div>
      )}
    </div>
  )
}
