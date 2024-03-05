"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "../@/lib/utils";
import { Button } from "../@/components/ui/button";
import { Calendar } from "../@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../@/components/ui/popover";
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  setFilterData?: any;
  id?: string;
  filterData?: any; // Assuming setFilterData can be of any type
}

export const DatePickerWithRange: React.FC<Props> = ({
  className,
  setFilterData,
  filterData,
  id,
}: Props) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: null,
    to: null,
  });
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:w-full h-[48px] px-3 py-2 border text-left  font-normal flex justify-start outline-none border-[#828bab] rounded-lg"
            )}
          >
            <div className="h-[48px] items-center justify-center flex p flex-row text-xs">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={new Date()}
            selected={date}
            onSelect={(newDate) => {
              if (newDate.from && newDate.to) {
                const filtered = {
                  questionId: id,
                  dataRange: [
                    format(newDate.from, "yyyy-MM-dd"),
                    format(newDate.to, "yyyy-MM-dd"),
                  ],
                };

                // Create a new array based on the current filterData
                let newFilterData = [...filterData];

                // Find the index of the item with the same questionId
                const index = newFilterData.findIndex(
                  (item) => item.questionId === id
                );

                if (index !== -1) {
                  // Replace the existing item
                  newFilterData[index] = filtered;
                } else {
                  // Add the new item
                  newFilterData.push(filtered);
                }

                // Update the state
                setFilterData(newFilterData);
              }
              setDate(newDate);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
