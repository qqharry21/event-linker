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
import EventForm from "./event-form";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
export const CreateEventButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="cursor-pointer max-md:fixed max-md:right-4 max-md:bottom-4 max-md:z-10 max-md:size-9 max-md:rounded-full max-md:p-0"
        >
          <PlusIcon size={16} />
          <span className="hidden md:inline-block">Create New Event</span>
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
