export interface State {
  selectedOption: string;
}

export enum ActionTypes {
    SELECTOPTION = "SELECTOPTION",
}

export type Action =
  | { type: ActionTypes.SELECTOPTION; payload: string; }
