"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

// Define the form schema with zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  startTime: z.date({
    required_error: "Start time is required.",
  }),
  includeEndTime: z.boolean().default(false),
  endTime: z.date().optional(),
  location: z.string().optional(),
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
      location: "",
    },
  });

  // Watch the includeEndTime field to conditionally render the endTime field
  const includeEndTime = form.watch("includeEndTime");

  // Form submission handler
  function onSubmit(data: FormValues) {
    // If includeEndTime is false, remove endTime from the data
    if (!data.includeEndTime) {
      data.endTime = undefined;
    }
    console.log(data);
    // Handle form submission logic here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Event</CardTitle>
        <CardDescription>
          Fill in the details to create a new event.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tim's birthday..." {...field} />
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex w-full items-center gap-4 max-md:flex-col">
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
            </div>

            {/* Include End Time Toggle */}
            <FormField
              control={form.control}
              name="includeEndTime"
              render={({ field }) => (
                <label
                  className="flex flex-row items-center justify-between rounded-lg border p-3"
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
                    <Input placeholder="Event location" {...field} />
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
                  className="flex flex-row items-center justify-between rounded-lg border p-3"
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </label>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="mt-4 w-full">
              Create Event
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
