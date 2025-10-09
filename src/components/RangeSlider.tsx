import { Slider } from "@/components/ui/slider";

interface RangeSliderProps {
    value: [number, number];
    onChange: (value: [number, number]) => void;
    min: number;
    max: number;
    step?: number;
    disabled?: boolean;
    formatValue?: (value: number) => string;
}

export default function RangeSlider({
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false,
    formatValue = (val) => val.toLocaleString()
}: RangeSliderProps) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
                <span>{formatValue(value[0])}</span>
                <span>{formatValue(value[1])}</span>
            </div>
            <div className="w-full h-8 flex items-center">
                <Slider
                    value={value}
                    onValueChange={onChange}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    className="w-full"
                />
            </div>
        </div>
    );
}
