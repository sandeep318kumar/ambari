import { ReactNode } from "react";

export interface Step {
  label: String;
  completed: Boolean;
  Component: ReactNode;
  canGoBack: Boolean;
  isNextEnabled: Boolean;
  onNext?:any;
  nextLabel?:String;
}
