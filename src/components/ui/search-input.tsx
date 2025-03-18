import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import React from "react";
import { Input } from "./input";

export const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
        <SearchIcon className="text-muted-foreground h-4 w-4" />
      </div>
      <Input ref={ref} className="h-9 pl-10" {...props} />
    </div>
  );
});

SearchInput.displayName = "SearchInput";
