"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createEvent } from "@/app/actions/event";
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
import { redirect } from "next/navigation";
import { toast } from "sonner";

// Define the form schema with zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  startTime: z.date({
    required_error: "Start time is required.",
  }),
  includeEndTime: z.boolean().default(false),
  endTime: z.date().nullable(),
  location: z.string(),
  hideParticipants: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function EventForm() {
  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      includeEndTime: false,
      hideParticipants: false,
      startTime: new Date(),
      endTime: null,
      location: "",
    },
  });

  // Watch the includeEndTime field to conditionally render the endTime field
  const startTime = form.watch("startTime");
  const includeEndTime = form.watch("includeEndTime");

  // Form submission handler
  async function onSubmit(data: FormValues) {
    // If includeEndTime is false, remove endTime from the data
    if (!data.includeEndTime) {
      data.endTime = null;
    }
    console.log(data);
    // Handle form submission logic here
    const res = await createEvent(data);
    console.log("🚨 - res", res);
    if (res.status === 201) {
      form.reset(
        {},
        {
          keepDefaultValues: true,
          keepDirty: false,
        },
      );
      toast(res.message);
      redirect("/dashboard");
    } else toast(res.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
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

        {/* Start Time Field */}
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Start Time</FormLabel>
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

        {/* End Time Field - Conditionally rendered */}
        {includeEndTime && (
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>End Time</FormLabel>
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
                      selected={field.value || new Date()}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startTime = form.getValues("startTime");
                        return startTime && date < startTime;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Include End Time Toggle */}
        <FormField
          control={form.control}
          name="includeEndTime"
          render={({ field }) => (
            <label
              className="flex flex-row items-center justify-between rounded-lg border p-3 text-left"
              htmlFor="includeEndTime"
            >
              <div className="space-y-0.5">
                <span className="text-sm leading-none font-medium select-none">
                  Include End Time
                </span>
                <FormDescription>
                  Toggle to add an end time for your event
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="includeEndTime"
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

        {/* Location Field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
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
              className="flex flex-row items-center justify-between rounded-lg border p-3 text-left"
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
          className="w-full cursor-pointer"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Loading..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
