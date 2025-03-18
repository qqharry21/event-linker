"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ArrowLeftIcon, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Animation variants
const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

const fadeUpDownVariants: Variants = {
  enter: { y: 50 },
  center: { y: 0 },
  exit: { y: -50 },
};

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

enum Step {
  HOURS,
  MINUTES,
  PERIOD,
}

export function TimePicker({
  value,
  onChange,
  disabled,
  placeholder = "Select time",
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState<number>(12);
  const [minutes, setMinutes] = useState<number>(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [step, setStep] = useState<Step>(Step.HOURS);
  const [direction, setDirection] = useState<number>(0);

  const previousStepRef = useRef<Step | null>(null);

  // Parse the input value when it changes externally
  useEffect(() => {
    if (value) {
      const [hourStr, minuteStr] = value.split(":");
      let hour = Number.parseInt(hourStr, 10);
      const minute = Number.parseInt(minuteStr, 10);

      // Convert 24-hour format to 12-hour format
      let newPeriod: "AM" | "PM" = "AM";
      if (hour >= 12) {
        newPeriod = "PM";
        if (hour > 12) hour -= 12;
      } else if (hour === 0) {
        hour = 12;
      }

      setHours(hour);
      setMinutes(minute);
      setPeriod(newPeriod);
    }
  }, [value]);

  // Reset step when opening the picker
  useEffect(() => {
    if (open) {
      setStep(Step.HOURS);
    }
  }, [open]);

  // Update the time when any component changes
  const updateTime = (
    newHours?: number,
    newMinutes?: number,
    newPeriod?: "AM" | "PM",
  ) => {
    const h = newHours ?? hours;
    const m = newMinutes ?? minutes;
    const p = newPeriod ?? period;

    // Convert to 24-hour format for the form value
    let hour24 = h;
    if (p === "PM" && h < 12) hour24 += 12;
    if (p === "AM" && h === 12) hour24 = 0;

    const timeString = `${hour24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    onChange(timeString);
  };

  // Generate arrays of hours and minutes for selection
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  // Format the display time
  const formatDisplayTime = () => {
    if (!value) return placeholder;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Handle hour selection
  const handleHourSelect = (hour: number) => {
    setHours(hour);
    updateTime(hour);
    setDirection(1);
    setStepWithPrevious(Step.MINUTES);
  };

  // Handle minute selection
  const handleMinuteSelect = (minute: number) => {
    setMinutes(minute);
    updateTime(undefined, minute);
    setDirection(1);
    setStepWithPrevious(Step.PERIOD);
  };

  // Handle period toggle
  const handlePeriodToggle = (checked: boolean) => {
    const newPeriod = checked ? "PM" : "AM";
    setPeriod(newPeriod);
    updateTime(undefined, undefined, newPeriod);
  };

  // Handle back button
  const handleBack = () => {
    if (step === Step.MINUTES) {
      setDirection(-1);
      setStep(Step.HOURS);
    } else if (step === Step.PERIOD) {
      setDirection(-1);
      setStep(Step.MINUTES);
    }
  };

  // Handle done button
  const handleDone = () => {
    setOpen(false);
  };

  const setStepWithPrevious = (newStep: Step) => {
    previousStepRef.current = step;
    setStep(newStep);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayTime()}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="relative w-[280px] overflow-hidden p-0"
        align="start"
      >
        <div className="p-4">
          <div className="mb-4 text-center">
            <div className="overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  className="text-muted-foreground block text-sm"
                  key={step}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={fadeUpDownVariants}
                  transition={{
                    ease: "easeInOut",
                    duration: 0.35,
                  }}
                >
                  {step === Step.HOURS && "Select Hour"}
                  {step === Step.MINUTES && "Select Minutes"}
                  {step === Step.PERIOD && "Select AM/PM"}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {hours.toString().padStart(2, "0")}:
              {minutes.toString().padStart(2, "0")} {period}
            </div>
          </div>

          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {step === Step.HOURS && (
              <motion.div
                key={Step.HOURS}
                variants={variants}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="grid grid-cols-4 gap-2"
              >
                {hourOptions.map((hour) => (
                  <Button
                    key={hour}
                    variant={hours === hour ? "default" : "outline"}
                    className="h-10 w-14"
                    onClick={() => handleHourSelect(hour)}
                  >
                    {hour}
                  </Button>
                ))}
              </motion.div>
            )}

            {step === Step.MINUTES && (
              <motion.div
                key={Step.MINUTES}
                variants={variants}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="grid grid-cols-4 gap-2"
              >
                {minuteOptions.map((minute) => (
                  <Button
                    key={minute}
                    variant={minutes === minute ? "default" : "outline"}
                    className="h-10 w-14"
                    onClick={() => handleMinuteSelect(minute)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </motion.div>
            )}

            {step === Step.PERIOD && (
              <motion.div
                key={Step.PERIOD}
                variants={variants}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex flex-col items-center space-y-6"
              >
                <div className="flex items-center space-x-4">
                  <span
                    className={cn(
                      "text-lg",
                      period === "AM"
                        ? "font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    AM
                  </span>
                  <Switch
                    checked={period === "PM"}
                    onCheckedChange={handlePeriodToggle}
                  />
                  <span
                    className={cn(
                      "text-lg",
                      period === "PM"
                        ? "font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    PM
                  </span>
                </div>
                <Button onClick={handleDone} className="w-full">
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {step !== Step.HOURS && (
            <button
              className="absolute top-[18px] left-4 cursor-pointer transition-opacity hover:opacity-60 focus-visible:opacity-60"
              onClick={handleBack}
            >
              <ArrowLeftIcon size={16} />
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
