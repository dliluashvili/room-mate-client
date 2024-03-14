"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../@/lib/utils";
import { Button } from "../@/components/ui/button";
import { Calendar } from "../@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../@/components/ui/popover";
import useTranslation from "next-translate/useTranslation";

export function BirthDatePicker({ field }) {
  const [date, setDate] = React.useState<Date>(field.value);
  let { t } = useTranslation("common");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full md:w-full h-[48px] px-3 py-2 border text-left hover:bg-white  font-normal flex justify-start outline-none border-[#828bab] rounded-lg",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 mb-[1px] " />
          {date ? (
            format(date, "LLL dd, y")
          ) : (
            <span className="text-muted-foreground ">{t("chooseDate")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          classNames={{
            caption_label: "hidden",
            nav_button_previous: "hidden",
            nav_button_next: "hidden",
          }}
          captionLayout="dropdown-buttons" // Renders dropdowns for years and months
          fromYear={1960}
          toYear={2005}
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            let formattedDate = format(newDate, "yyyy-MM-dd");
            field.onChange(formattedDate.toString());
            setDate(newDate);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
