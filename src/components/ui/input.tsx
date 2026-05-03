import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2 text-sm placeholder:text-ink-900/40 focus-visible:outline-none focus-visible:border-saffron-600 focus-visible:ring-1 focus-visible:ring-saffron-600/30 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-3 text-sm placeholder:text-ink-900/40 focus-visible:outline-none focus-visible:border-saffron-600 focus-visible:ring-1 focus-visible:ring-saffron-600/30 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
