import { cloneDeep } from "lodash";
import { State, Action, ActionTypes } from "./types";

export const initialState: State = {
  enableHighAvailibilityRangerAdminSteps: {},
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.STORE_INFORMATION:
      const stateCopy = cloneDeep(state);
      if (!stateCopy.enableHighAvailibilityRangerAdminSteps) {
        stateCopy.enableHighAvailibilityRangerAdminSteps = {};
      }
      const enableHighAvailibilityRangerAdminSteps = cloneDeep(
        stateCopy.enableHighAvailibilityRangerAdminSteps
      );
      enableHighAvailibilityRangerAdminSteps[action.payload.step] =
        action.payload;
      stateCopy.enableHighAvailibilityRangerAdminSteps =
        enableHighAvailibilityRangerAdminSteps;
      return stateCopy;
    case ActionTypes.SYNC_STATE:
      return { ...action.payload };
    case ActionTypes.REMOVE_KEY:
      const updatedSteps = { ...state.enableHighAvailibilityRangerAdminSteps };
      delete updatedSteps[action.payload.key];
      return { ...state, enableHighAvailibilityRangerAdminSteps: updatedSteps };
    default:
      return state;
  }
};
