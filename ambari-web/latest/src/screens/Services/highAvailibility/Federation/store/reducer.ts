import { State, Action, ActionTypes } from "./types";

export const initialState: State = { enableNamenodeFederationSteps: {} };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.STORE_INFORMATION:
      const stateCopy = { ...state };
      const enableNamenodeFederationSteps = { ...stateCopy.enableNamenodeFederationSteps };
      enableNamenodeFederationSteps[action.payload.step] = action.payload;
      return { ...state, enableNamenodeFederationSteps };
    case ActionTypes.SYNC_STATE:
      console.log("Payload in Provider",action.payload)
      return {...action.payload}
    case ActionTypes.REMOVE_KEY:
      const newState = { ...state };
      const newSteps = { ...newState.enableNamenodeFederationSteps };
      delete newSteps[action.payload.key];
      return { ...newState, enableNamenodeFederationSteps: newSteps };
    default:
      return state;
  }
};
