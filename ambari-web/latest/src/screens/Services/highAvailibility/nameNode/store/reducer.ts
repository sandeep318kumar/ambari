import { cloneDeep } from "lodash";
import { State, Action, ActionTypes } from "./types";

export const initialState: State = { enableHighAvailibilitySteps: {} };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.STORE_INFORMATION:
      const stateCopy = cloneDeep(state);
      if (!stateCopy.enableHighAvailibilitySteps) {
        stateCopy.enableHighAvailibilitySteps = {};
      }
      const enableHighAvailibilitySteps = cloneDeep(
        stateCopy.enableHighAvailibilitySteps
      );
      enableHighAvailibilitySteps[action.payload.step] = action.payload;
      stateCopy.enableHighAvailibilitySteps = enableHighAvailibilitySteps;
      return stateCopy;
    case ActionTypes.SYNC_STATE:
      return { ...action.payload };
    case ActionTypes.REMOVE_KEY:
      const updatedSteps = { ...state.enableHighAvailibilitySteps };
      delete updatedSteps[action.payload.key];
      return { ...state, enableHighAvailibilitySteps: updatedSteps };
    default:
      return state;
  }
};
