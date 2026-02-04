import { Button } from "react-bootstrap";

function DefaultButton({ className, ...props }: any) {
  className = className ? className + " btn-default" : "btn-default";
  return <Button className={className} {...props}></Button>;
}

export default DefaultButton;