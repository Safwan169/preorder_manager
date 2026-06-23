"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  "aria-label"?: string;
};

export function Checkbox({
  checked,
  indeterminate = false,
  onCheckedChange,
  "aria-label": ariaLabel,
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      aria-label={ariaLabel}
      onChange={(event) => onCheckedChange?.(event.target.checked)}
      className={cn(
        "h-4 w-4 cursor-pointer rounded border-neutral-300 text-neutral-900",
        "accent-neutral-900 focus:ring-neutral-900",
      )}
    />
  );
}
