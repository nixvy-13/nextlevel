import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const fieldVariants = cva("space-y-2")
const fieldGroupVariants = cva("space-y-6")
const fieldSetVariants = cva("space-y-6")
const fieldLabelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)
const fieldDescriptionVariants = cva("text-sm text-muted-foreground")
const fieldErrorVariants = cva("text-sm font-medium text-destructive")

export const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical" | "responsive"
  }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div
    ref={ref}
    data-orientation={orientation}
    className={cn(
      fieldVariants(),
      orientation === "horizontal" && "flex flex-row items-center gap-4",
      orientation === "responsive" && "flex flex-col sm:flex-row sm:items-center sm:gap-4",
      className
    )}
    {...props}
  />
))
Field.displayName = "Field"

export const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(fieldGroupVariants(), className)} {...props} />
))
FieldGroup.displayName = "FieldGroup"

export const FieldSet = React.forwardRef<
  HTMLFieldSetElement,
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
  <fieldset ref={ref} className={cn(fieldSetVariants(), className)} {...props} />
))
FieldSet.displayName = "FieldSet"

export const FieldContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
))
FieldContent.displayName = "FieldContent"

export const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn(fieldLabelVariants(), className)} {...props} />
))
FieldLabel.displayName = "FieldLabel"

export const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.HTMLAttributes<HTMLLegendElement>
>(({ className, ...props }, ref) => (
  <legend
    ref={ref as React.Ref<HTMLLegendElement>}
    className={cn("text-base font-semibold leading-none", className)}
    {...props}
  />
))
FieldLegend.displayName = "FieldLegend"

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn(fieldDescriptionVariants(), className)} {...props} />
))
FieldDescription.displayName = "FieldDescription"

export const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    errors?: Array<{ message?: string }>
  }
>(({ className, errors, ...props }, ref) => {
  if (!errors || errors.length === 0) return null

  return (
    <div className="space-y-1">
      {errors.map((error, index) => (
        <p
          key={index}
          ref={index === 0 ? ref : undefined}
          className={cn(fieldErrorVariants(), className)}
          {...(index === 0 ? props : {})}
        >
          {error?.message || "Campo requerido"}
        </p>
      ))}
    </div>
  )
})
FieldError.displayName = "FieldError"

export const FieldSeparator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr ref={ref} className={cn("my-4", className)} {...props} />
))
FieldSeparator.displayName = "FieldSeparator"

export const FieldTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref as React.Ref<HTMLHeadingElement>}
    className={cn(fieldLabelVariants(), className)}
    {...props}
  />
))
FieldTitle.displayName = "FieldTitle"



