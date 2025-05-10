"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createEvent } from "@/actions/event";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TimePicker } from "./ui/time-picker";

// Define the form schema with zod
const formSchema = z
  .object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string(),
    date: z.date({
      required_error: "Start date is required.",
    }),
    endDate: z.date().nullable(),
    isFullDayEvent: z.boolean().default(false),
    startTime: z.string().nullable(),
    endTime: z.string().nullable(),
    location: z.string(),
    hideParticipants: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.isFullDayEvent) {
        return data.startTime === null;
      } else {
        return typeof data.startTime === "string";
      }
    },
    {
      message: "Start time must be provided for non-full day events",
      path: ["startTime"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

export default function EventForm({ onClose }: { onClose: () => void }) {
  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isFullDayEvent: false,
      hideParticipants: false,
      location: "",
      date: new Date(),
      endDate: null,
      startTime: null,
      endTime: null,
    },
  });

  // Watch the isFullDayEvent field to conditionally render the endTime field
  const startTime = form.watch("startTime");
  const isFullDayEvent = form.watch("isFullDayEvent");

  // Form submission handler
  async function onSubmit({ isFullDayEvent, ...data }: FormValues) {
    if (isFullDayEvent) {
      data.startTime = null;
      data.endTime = null;
    }
    console.log(data);
    // Handle form submission logic here
    const res = await createEvent({ ...data, archived: false });

    if (res.status === 201) {
      form.reset(
        {},
        {
          keepDefaultValues: true,
          keepDirty: false,
        },
      );
      toast(res.message);
      onClose();
    } else toast(res.message);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Tim's birthday..."
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide details about the event"
                  className="min-h-[100px]"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={form.formState.isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>End Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={form.formState.isSubmitting}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || form.watch("date")}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Include End Time Toggle */}
        <FormField
          control={form.control}
          name="isFullDayEvent"
          render={({ field }) => (
            <label
              className="col-span-full flex flex-row items-center justify-between rounded-lg border p-3 text-left"
              htmlFor="isFullDayEvent"
            >
              <div className="space-y-0.5">
                <span className="text-sm leading-none font-medium select-none">
                  Full Day Event
                </span>
                <FormDescription>
                  Check this box if this is a full day event (no specific time)
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="isFullDayEvent"
                  disabled={form.formState.isSubmitting}
                  checked={field.value}
                  onCheckedChange={(val) => {
                    field.onChange(val);
                    if (val === true) {
                      form.setValue("endTime", startTime);
                    }
                  }}
                />
              </FormControl>
            </label>
          )}
        />

        {/* Start Time/End Time Field - Conditionally rendered */}
        {!isFullDayEvent && (
          <>
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Select start time"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>End Time (Optional)</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Select end time"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Location Field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Event location"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hide Participants Toggle */}
        <FormField
          control={form.control}
          name="hideParticipants"
          render={({ field }) => (
            <label
              className="col-span-full flex flex-row items-center justify-between rounded-lg border p-3 text-left"
              htmlFor="hideParticipants"
            >
              <div className="space-y-0.5">
                <span className="text-sm leading-none font-medium select-none">
                  Hide Participant Information
                </span>
                <FormDescription>
                  Hide participant details from other users
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="hideParticipants"
                  disabled={form.formState.isSubmitting}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </label>
          )}
        />

        <Button
          type="submit"
          className="col-span-full w-full cursor-pointer"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Loading..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
