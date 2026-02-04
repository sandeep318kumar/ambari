import { ReactNode } from "react";

interface ChartContainerProps {
  children?: ReactNode;
  text?: string;
  onHoverContent?: string;
}

function ChartContainer({
  children,
  text,
  onHoverContent,
}: ChartContainerProps) {
  return (
    <>
      <div className="mt-2 position-relative">
        {children}
        <div className="hover-content">{onHoverContent}</div>
      </div>
      <h3 className="widget-card-percentage">{text}</h3>
    </>
  );
}
export default ChartContainer;
