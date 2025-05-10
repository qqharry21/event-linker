"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import EventForm from "./event-form";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export const CreateEventButton = ({
  isSidebar = true,
  className,
}: {
  isSidebar?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className={cn(
            "cursor-pointer",
            isSidebar &&
              "max-md:fixed max-md:right-4 max-md:bottom-4 max-md:z-10 max-md:hidden max-md:size-9 max-md:rounded-full max-md:p-0",
            className,
          )}
        >
          <PlusIcon size={16} />
          <span className={cn(isSidebar && "max-md:hidden")}>
            Create New Event
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new event.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="scrollbar-hide overflow-auto px-1 max-md:max-h-[500px]">
          <EventForm onClose={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
