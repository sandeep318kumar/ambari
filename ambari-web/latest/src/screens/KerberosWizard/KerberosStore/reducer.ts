import { cloneDeep } from "lodash";
import { State, Action, ActionTypes } from "./types";

export const initialState: State = { 
  kerberosWizardSteps: {} 
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.STORE_INFORMATION:
      const stateCopy = cloneDeep(state);
      if (!stateCopy.kerberosWizardSteps) {
        stateCopy.kerberosWizardSteps = {};
      }
      const enableHighAvailibilityRangerAdminSteps = cloneDeep(
        stateCopy.kerberosWizardSteps
      );
      enableHighAvailibilityRangerAdminSteps[action.payload.step] =
        action.payload;
      stateCopy.kerberosWizardSteps = enableHighAvailibilityRangerAdminSteps;
      return stateCopy;
    case ActionTypes.SYNC_STATE:
      return { ...action.payload };
    case ActionTypes.REMOVE_KEY:
      const updatedSteps = { ...state.kerberosWizardSteps };
      delete updatedSteps[action.payload.key];
      return { ...state, kerberosWizardSteps: updatedSteps };
    default:
      return state;
  }
};
