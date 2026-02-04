import React from 'react';
import { Row } from 'react-bootstrap';
import HeatmapRack from './HeatmapRack';

interface HeatmapGridProps {
  racks: any[];
  hostToSlotMap: Record<string, number>;
  hostToValueMap: Record<string, string | undefined>;
  slotDefinitions: any[];
  units?: string;
  onHostClick?: (host: any) => void;
  selectedMetric: any;
}

const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  racks,
  hostToSlotMap,
  hostToValueMap,
  slotDefinitions,
  units,
  onHostClick,
  selectedMetric
}) => {
  const getRackClass = (rackCount: number): string => {
    if (rackCount < 2) {
      return "col-12";
    }
    if (rackCount === 2) {
      return "col-md-6";
    }
    return "col-md-4";
  };

  return (
    <Row className="g-3">
      {racks.map((rack) => (
        <div key={rack.rackId} className={getRackClass(racks.length)}>
          <HeatmapRack
            rack={rack}
            hostToSlotMap={hostToSlotMap}
            hostToValueMap={hostToValueMap}
            slotDefinitions={slotDefinitions}
            units={units}
            onHostClick={onHostClick}
            selectedMetric={selectedMetric}
          />
        </div>
      ))}
    </Row>
  );
};

export default HeatmapGrid;
