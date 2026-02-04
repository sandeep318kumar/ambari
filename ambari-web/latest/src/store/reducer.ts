import { State, Action, ActionTypes } from "./types";

export const initialState: State = { selectedOption: "dashboard" };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SELECTOPTION:
      return { ...state, selectedOption: action.payload };
    default:
      return state;
  }
};
