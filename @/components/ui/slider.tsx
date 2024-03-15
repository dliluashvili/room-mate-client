import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  id: string;
  filterDataBefore: any; // replace 'any' with the actual type
  setFilterDataBefore: any; // replace 'any' with the actual type
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, id, filterDataBefore, setFilterDataBefore, ...props }, ref) => {
  const [sliderValues, setSliderValues] = React.useState([0, 1000]);

  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-3 -mt-2">
        <div>{sliderValues[0]} $</div>
        <div>{sliderValues[1]} $</div>
      </div>
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        onValueChange={(value) => {
          setSliderValues(value); // Update the slider values state

          const stringValues = value.map(String);
          const filtered = {
            questionId: id,
            dataRange: stringValues,
          };

          // Create a new array based on the current filterData
          let newFilterData = [...filterDataBefore];

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
          setFilterDataBefore(newFilterData);
        }}
        min={0}
        max={1000}
        defaultValue={[0, 1000]}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-[#D9D9D9] pointer">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb className="block h-5 w-5 pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50" />
        <SliderPrimitive.Thumb className="block h-5 w-5 pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
