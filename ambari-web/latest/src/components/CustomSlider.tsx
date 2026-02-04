import React, { useState, useRef, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertValue, formatTickLabel } from '../Utils/unitConversionUtils';

interface CustomSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  onChange: (value: number | number[]) => void;
  disabled?: boolean;
  marks?: Record<number, string>;
  propertyUnit: string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  min,
  max,
  step,
  value,
  unit = '',
  onChange,
  disabled = false,
  marks,
  propertyUnit
}) => {
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  /**
   * Round number to 3 digits after "."
   * Used for all slider's ticks (matches Ember _extraRound method)
   */
  const extraRound = (v: number): number => {
    return parseFloat(v.toFixed(3));
  };

  /**
   * Format tooltip value using the centralized formatTickLabel function
   */
  const formatTooltipValue = (tick: number): string => {
    return formatTickLabel(tick, unit || '', '');
  };

  // Convert value from property unit to widget unit for display
  const displayValue: number = extraRound(convertValue(value, propertyUnit, unit, false) as number);
  
  // Update tooltip position when value changes
  useEffect(() => {
    if (sliderRef.current) {
      let percentage = ((displayValue - min) / (max - min)) * 100;

      if (percentage < 1) percentage = 1;
      if (percentage > 99) percentage = 99;

      setTooltipPosition(percentage);
    }
  }, [displayValue, min, max]);
  
  return (
    <div className="custom-slider-container" ref={sliderRef}>
      {/* Value tooltip - matches Ember formatter function behavior */}
      <div 
        className="custom-slider-tooltip"
        style={{ 
          left: `${tooltipPosition}%`,
        }}
      >
        {formatTooltipValue(displayValue)}
      </div>
      
      <Slider
        min={min}
        max={max}
        step={step}
        marks={marks}
        value={displayValue}
        onChange={(val) => {
          // Convert the slider value back to the original unit before passing to parent
          const originalUnitValue = convertValue(val as number, unit, propertyUnit, false) as number;
          onChange(originalUnitValue);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default CustomSlider;
