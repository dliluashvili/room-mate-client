import { useState, useEffect, forwardRef, ElementRef } from 'react'
import { Root, Track, Range, Thumb } from '@radix-ui/react-slider'
import { cn } from '../../utils/cn'

type RangeDataProps = {
    questionId: string
    dataRange: string[] | string
}

type SliderProps = {
    questionId: string
    questionName: string
    rangeChangeHandler: (questionId: string, questionName: string, values: string[]) => void
    ranges: RangeDataProps[]
    className?: string
    isOpen: boolean
}

const Slider = forwardRef<ElementRef<typeof Root>, SliderProps>(
    (
        { className, questionId, ranges, isOpen, questionName, rangeChangeHandler, ...props },
        ref
    ) => {
        const [sliderValues, setSliderValues] = useState([0, 1000])
        const updateRangeHandler = () => {
            const sliderValuesAsString = sliderValues.map(String)
            rangeChangeHandler(questionId, questionName, sliderValuesAsString as string[])
        }

        useEffect(() => {
            const matchingQuestion = ranges.find((item) => item.questionId === questionId)
            if (matchingQuestion && Array.isArray(matchingQuestion.dataRange)) {
                const dataRangeAsNumbers = matchingQuestion.dataRange.map(Number)
                setSliderValues(dataRangeAsNumbers)
            }
        }, [ranges, questionId, isOpen])

        return (
            <div>
                <div className="-mt-1 mb-3 flex flex-row items-center justify-between">
                    <div>{sliderValues[0]} $</div>
                    <div>{sliderValues[1]} $</div>
                </div>
                <Root
                    ref={ref}
                    className={cn(
                        'relative flex w-full touch-none select-none items-center',
                        className
                    )}
                    onValueChange={(value) => {
                        setSliderValues(value)
                    }}
                    min={0}
                    max={1000}
                    value={sliderValues}
                    onPointerUp={updateRangeHandler}
                    {...props}
                >
                    <Track className="cursro-pointer relative h-1 w-full grow overflow-hidden rounded-full bg-[#D9D9D9]">
                        <Range className="absolute h-full bg-mainGreen" />
                    </Track>
                    <Thumb className="block h-5 w-5 cursor-pointer rounded-full border-2 border-mainGreen  bg-white transition-colors focus-visible:outline-none active:ring-2 disabled:pointer-events-none disabled:opacity-50" />
                    <Thumb className="block h-5 w-5 cursor-pointer rounded-full border-2 border-mainGreen bg-white transition-colors  focus-visible:outline-none active:ring-2 disabled:pointer-events-none disabled:opacity-50" />
                </Root>
            </div>
        )
    }
)
Slider.displayName = Root.displayName

export { Slider }
