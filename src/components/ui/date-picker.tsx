"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  error?: boolean;
}

export function DatePicker<T extends FieldValues>({
  name,
  control,
  placeholder = "Chọn ngày",
  error,
}: DatePickerProps<T>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // Convert string (YYYY-MM-DD) to Date for calendar
        const dateValue = field.value
          ? parse(field.value, "yyyy-MM-dd", new Date())
          : undefined;

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-full bg-navy-deep/50 border rounded-xl py-4 px-4 text-left text-white focus:outline-none transition-all backdrop-blur-sm flex items-center justify-between",
                  error
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                    : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50",
                  !field.value && "text-gray-600"
                )}
              >
                <span>
                  {field.value
                    ? format(dateValue!, "dd/MM/yyyy", { locale: vi })
                    : placeholder}
                </span>
                <CalendarIcon className="h-5 w-5 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  // Convert Date to string (YYYY-MM-DD) for form
                  field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                  setOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}
