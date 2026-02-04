import { cloneDeep } from "lodash";
import { State, Action, ActionTypes } from "./types";

export const initialState: State = { clusterCreationSteps: {} };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.STORE_INFORMATION:
      const stateCopy = cloneDeep(state);
      if(!stateCopy.clusterCreationSteps){
        stateCopy.clusterCreationSteps = {};
      }
      const clusterCreationSteps = cloneDeep(stateCopy.clusterCreationSteps);
      clusterCreationSteps[action.payload.step] = action.payload;
      stateCopy.clusterCreationSteps = clusterCreationSteps;
      return stateCopy;
    case ActionTypes.SYNC_STATE:
      return { ...action.payload };
    case ActionTypes.REMOVE_KEY:
      const updatedSteps = { ...state.clusterCreationSteps };
      delete updatedSteps[action.payload.key];
      return { ...state, clusterCreationSteps: updatedSteps };
    default:
      return state;
  }
};
