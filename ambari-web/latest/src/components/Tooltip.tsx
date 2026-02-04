import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";

interface TooltipComponentProps {
  message: any;
  children: any;
  heading?: string;
  placement?: "top" | "right" | "bottom" | "left";
}

const Tooltip: React.FC<TooltipComponentProps> = ({
  message,
  children,
  heading = "",
  placement = "top",
}) => {
  // Clean up the message by trimming whitespace and normalizing line breaks
  const cleanMessage = typeof message === 'string' 
    ? message.trim().replace(/\s+/g, ' ').replace(/\n\s*/g, ' ')
    : message;

  // Clean up the heading
  const cleanHeading = typeof heading === 'string' 
    ? heading.trim().replace(/\s+/g, ' ').replace(/\n\s*/g, ' ')
    : heading;

  // Don't render tooltip if:
  // 1. Message is empty, null, undefined, or just whitespace
  // 2. Message is the same as the heading (redundant)
  if (!cleanMessage || 
      (typeof cleanMessage === 'string' && cleanMessage.trim() === '') ||
      (cleanMessage === cleanHeading)) {
    return <>{children}</>;
  }

  const renderPopover = (props: any) => (
    <Popover id="popover-basic" {...props}>
      {cleanHeading && <Popover.Header as="h3">{cleanHeading}</Popover.Header>}
      <Popover.Body style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
        {cleanMessage}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger 
      placement={placement} 
      overlay={renderPopover}
      trigger={['hover', 'focus']}
    >
      {children}
    </OverlayTrigger>
  );
};

export default Tooltip;
