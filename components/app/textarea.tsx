"use client"

import * as React from "react"
import { Textarea as UiTextarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AppTextAreaProps extends React.ComponentProps<typeof UiTextarea> {
  label?: string
  labelExtra?: React.ReactNode
}

const AppTextArea = React.forwardRef<HTMLTextAreaElement, AppTextAreaProps>(
  ({ label, labelExtra, id, className, ...props }, ref) => {
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
        <UiTextarea
          id={id}
          className={cn("min-h-[100px]", className)}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

AppTextArea.displayName = "AppTextArea"

export { AppTextArea }
