import { cloneDeep } from "lodash";
import { State, Action, ActionTypes } from "./types";

export const initialState: State = { manageJournalNodesSteps: {} };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.STORE_INFORMATION:
      const stateCopy = cloneDeep(state);
      if (!stateCopy.manageJournalNodesSteps) {
        stateCopy.manageJournalNodesSteps = {};
      }
      const manageJournalNodesSteps = cloneDeep(
        stateCopy.manageJournalNodesSteps
      );
      manageJournalNodesSteps[action.payload.step] = action.payload;
      stateCopy.manageJournalNodesSteps = manageJournalNodesSteps;
      return stateCopy;
    case ActionTypes.SYNC_STATE:
      return { ...action.payload };
    case ActionTypes.REMOVE_KEY:
      const updatedSteps = { ...state.manageJournalNodesSteps };
      delete updatedSteps[action.payload.key];
      return { ...state, manageJournalNodesSteps: updatedSteps };
    default:
      return state;
  }
};
