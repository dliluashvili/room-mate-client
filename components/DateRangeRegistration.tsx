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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../@/components/ui/drawer";
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  setFilterData?: any;
  upd?: any;
  field?: any;
  id?: string;
  filterData?: any; // Assuming setFilterData can be of any type
}

export const DatePickerWithRangeRegistration: React.FC<Props> = ({
  className,
  upd,
  field,
  id,
}: Props) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: null,
    to: null,
  });

  console.log(date);

  return (
    <>
      <div className={cn(" gap-2 hidden md:grid", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full md:w-full h-[48px] px-3 py-2 border text-left  font-normal flex justify-start outline-none border-[#828bab] rounded-lg"
              )}
            >
              <div className="h-[48px] items-center justify-center flex p flex-row text-sm">
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
              numberOfMonths={2}
              mode="range"
              pagedNavigation
              defaultMonth={new Date()}
              selected={date}
              onSelect={setDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Drawer>
        <DrawerTrigger className="w-full mt-2">
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:hidden md:w-full h-[48px] px-3 py-2 border text-left  font-normal flex justify-start outline-none border-[#828bab] rounded-lg"
            )}
          >
            <div className="h-[48px]   items-center justify-center flex p flex-row text-sm">
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
        </DrawerTrigger>
        <DrawerContent>
          <Calendar
            className="flex flex-row justify-center"
            initialFocus
            numberOfMonths={2}
            mode="range"
            pagedNavigation
            defaultMonth={new Date()}
            selected={date}
            onSelect={(newDate) => {
              if (newDate?.from && newDate?.to) {
                field.onChange([
                  format(newDate.from, "yyyy-MM-dd"),
                  format(newDate.to, "yyyy-MM-dd"),
                ]);
                upd({
                  [id]: [
                    format(newDate.from, "yyyy-MM-dd"),
                    format(newDate.to, "yyyy-MM-dd"),
                  ],
                });
              }

              setDate(newDate);
            }}
          />
          <DrawerClose>
            <Button variant="default" className="w-4/5">
              Submit
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </>
  );
};
