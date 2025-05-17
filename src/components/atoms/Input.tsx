import React from "react"
import { Input as ShadcnInput } from "../ui/input"
import { cn } from "../../lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return <ShadcnInput ref={ref} className={cn(error ? "border-destructive" : "", className)} {...props} />
})

Input.displayName = "Input"
