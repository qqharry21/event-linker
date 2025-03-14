import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import EventForm from "./event-form";
import { Button } from "./ui/button";

export const CreateEventButton = () => {
  return (
    <Dialog>
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
        <div className="bg-primary/20 h-px w-full"></div>
        <div className="scrollbar-hide max-h-[500px] overflow-auto">
          <EventForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};
