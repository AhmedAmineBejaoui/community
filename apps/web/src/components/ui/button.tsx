"use client"
import * as React from "react"
import { cn } from "../../lib/utils"

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

function Slot({ asChild, className, children, ...rest }: any) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn((children as React.ReactElement<any>).props.className, className),
      ...rest,
    })
  }
  return <button className={className} {...rest}>{children}</button>
}

export const Button = React.forwardRef(
  (
    { className, variant = "default", size = "default", asChild, ...props }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    const base = "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"

    const variants: Record<string, string> = {
      default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      outline: "border border-slate-300 bg-white hover:bg-slate-50",
      ghost: "bg-transparent hover:bg-slate-100",
      destructive: "bg-rose-600 text-white hover:bg-rose-700",
    }

    const sizes: Record<string, string> = {
      sm: "h-9 px-3 text-sm",
      default: "h-10 px-4",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-0",
    }

    const Comp: any = Slot
    return (
      <Comp
        ref={ref as any}
        asChild={asChild}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
