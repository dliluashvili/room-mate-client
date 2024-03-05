import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  id: string;
  filterData: any; // replace 'any' with the actual type
  setFilterData: any; // replace 'any' with the actual type
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, id, filterData, setFilterData, ...props }, ref) => {
  const [sliderValues, setSliderValues] = React.useState([100, 500]);

  return (
    <div>
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
        }}
        min={100}
        max={1000}
        defaultValue={[100, 500]}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
      <div>First Value: {sliderValues[0]}</div>
      <div>Second Value: {sliderValues[1]}</div>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
