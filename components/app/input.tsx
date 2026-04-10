"use client"

import * as React from "react"
import { Input as UiInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppInputProps extends React.ComponentProps<typeof UiInput> {
  label?: string
  labelExtra?: React.ReactNode
}

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, labelExtra, type, id, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const isPassword = type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    const togglePassword = () => setShowPassword(!showPassword)

    return (
      <div className="flex flex-col gap-2 w-full">
        {(label || labelExtra) && (
          <div className="flex items-center justify-between">
            {label && (
              <Label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {label}
              </Label>
            )}
            {labelExtra}
          </div>
        )}
        <div className="relative">
          <UiInput
            id={id}
            type={inputType}
            className={cn(className, isPassword && "pr-10")}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={togglePassword}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

AppInput.displayName = "AppInput"

export { AppInput }
