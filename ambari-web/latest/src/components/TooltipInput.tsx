import { Form } from "react-bootstrap";
import Tooltip from "./Tooltip";
import { ChangeEventHandler, FocusEventHandler } from "react";

type tooltipPropsType = {
  message: string;
  heading?: string;
  placement?: "top" | "right" | "bottom" | "left";
};

type formControlPropsType = {
  type: "text" | "password" | "email" | "number" | "checkbox";
  placeholder?: string;
  value?: string;
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  label?: string;
  checked?: boolean;
};

type TooltipInputProps = {
  tooltipProps: tooltipPropsType;
  formControlProps: formControlPropsType;
};

export default function TooltipInput({
  tooltipProps,
  formControlProps,
}: TooltipInputProps) {
  const { type, ...restProps } = formControlProps;

  return (
    <div>
      <Tooltip {...tooltipProps}>
        {type === "checkbox" ? (
          <Form.Check type={type} {...restProps} />
        ) : (
          <Form.Control type={type} {...restProps} />
        )}
      </Tooltip>
    </div>
  );
}
