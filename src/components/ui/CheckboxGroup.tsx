// CheckboxGroup.tsx
import { CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

const CheckboxGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return <div className={`grid gap-2 ${className}`} {...props} ref={ref} />;
});

CheckboxGroup.displayName = "CheckboxGroup";

const CheckboxGroupItem = React.forwardRef<
  React.ElementRef<"input">,
  React.ComponentPropsWithoutRef<"input"> & { label: string }
>(({ className, children, label, ...props }, ref) => {
  return (
    <label className={`flex items-center ${className}`}>
      <input type="checkbox" className="sr-only" {...props} ref={ref} />
      <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-primary text-primary transition-colors focus:ring-1 focus:ring-primary focus:ring-offset-1 focus:ring-offset-white">
        {props.checked && (
          <CheckIcon className="absolute h-2.5 w-2.5 fill-primary" />
        )}
      </div>
      <span className="ml-2">{label}</span>
    </label>
  );
});

CheckboxGroupItem.displayName = "CheckboxGroupItem";

export { CheckboxGroup, CheckboxGroupItem };
