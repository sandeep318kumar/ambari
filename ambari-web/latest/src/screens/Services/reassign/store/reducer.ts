import { cloneDeep } from "lodash";
import { State, Action, ActionTypes } from "./types";

export const initialState: State = { reassignSteps: {} };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.STORE_INFORMATION: 
      const stateCopy = cloneDeep(state);
      const reassignSteps = stateCopy.reassignSteps;
      reassignSteps[action.payload.step] = action.payload;
      return { ...stateCopy };
    case ActionTypes.SYNC_STATE:
      return { ...action.payload };
    case ActionTypes.SET_COMPONENT_NAME:
      const stateCopy2 = { ...state };
      stateCopy2.componentName = action.payload;
      return { ...stateCopy2 };
    case ActionTypes.REMOVE_KEY:
      const stateCopy3 = cloneDeep(state);
      if (stateCopy3.reassignSteps && stateCopy3.reassignSteps[action.payload.key]) {
        delete stateCopy3.reassignSteps[action.payload.key];
      }
      return { ...stateCopy3 };
    default:
      return state;
  }
};
