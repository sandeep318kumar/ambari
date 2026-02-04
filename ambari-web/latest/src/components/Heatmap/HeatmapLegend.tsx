import React from 'react';
import {InputGroup, FormControl } from 'react-bootstrap';

interface HeatmapLegendProps {
  selectedMetric: any;
  slotDefinitions: any[];
  inputMaximum: string;
  onInputMaximumChange: (value: string) => void;
}

const HeatmapLegend: React.FC<HeatmapLegendProps> = ({
  selectedMetric,
  slotDefinitions,
  inputMaximum,
  onInputMaximumChange
}) => {
  return (
    <>
        {selectedMetric && (
          <>
                {slotDefinitions.map((slot: any, index: number) => {
                  const backgroundColor = slot.cssStyle?.includes('background-color') 
                    ? slot.cssStyle.split(':')[1].trim() 
                    : '#f8f9fa';
                  
                  return (
                    <div key={index} className='d-flex align-items-center mt-3'>
                      <div>
                        <div 
                          className="legend-tile rounded"
                          style={{ 
                            width: '40px', 
                            height: '20px', 
                            backgroundColor: backgroundColor,
                            backgroundImage: slot.cssStyle?.includes('repeating-linear-gradient') 
                              ? slot.cssStyle.split(':').slice(1).join(':') 
                              : 'none',
                            border: '1px solid #ddd'
                          }}
                        ></div>
                      </div>
                      <div className="small ms-2">{slot.label}</div>
                    </div>
                  );
                })}

            <div className="mt-4">
              <strong>Maximum:</strong>
            </div>
            <InputGroup  className='mt-1'>
              <FormControl
                type="text"
                maxLength={8}
                value={inputMaximum}
                onChange={(e) => onInputMaximumChange(e.target.value)}
                placeholder={selectedMetric.maximumValue?.toString() || '100'}
              />
              <InputGroup.Text>{selectedMetric.units || ''}</InputGroup.Text>
            </InputGroup>
          </>
        )}
      </>
  );
};

export default HeatmapLegend;
